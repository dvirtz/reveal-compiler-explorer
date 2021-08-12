'use strict';

import { parseCode, compile as origCompile, CompileError } from 'compiler-explorer-directives';
import MarkdownIt from 'markdown-it';
import { promises } from 'fs';
import cheerio from 'cheerio';
import dedent from 'dedent';

class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ParseError';
  }
}

const elementLineNumber = (container, index) => {
  // https://stackoverflow.com/a/14482123/621176
  const nthIndex = (str, pat, n) => {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
      i = str.indexOf(pat, i);
      if (i < 0) break;
    }
    return i;
  };

  var upToElement = container.substr(0, nthIndex(container, "<code", index + 1));
  return (upToElement.match(/\n\r?/g) || []).length;
}

const parseMarkdown = async (markdown, config = {}) => {
  const md = new MarkdownIt({ html: true, breaks: true });
  const result = md.parse(markdown, {});
  const codeBlocks = result
    .filter(({ type, tag }) => type === 'fence' && tag === 'code')
    .map(({ content, info, map }) => { return { content: content, language: info.replace(/(\w+).*/, '$1'), line: map[0] + 1 }; })
    .concat(result
      .filter(({ type }) => type === 'html_block').flatMap(({ content, info, map }) => {
        const $ = cheerio.load(content);
        return $('pre code').map(function (index) {
          return {
            content: dedent($(this).text().replace(/(\n)/g, '$1 ')),
            language: $(this).attr("class"),
            line: map[0] + 1 + elementLineNumber(content, index)
          };
        }).toArray();
      }))
    .sort((a, b) => a.line - b.line);
  return []
    .concat
    .apply([], await Promise.all(codeBlocks
      .flatMap(async ({ content, language, line }) => {
        content.replace(/<\/?mark>/, '');
        const error = message => new ParseError(`${line}:\n${message}`);
        config = Object.assign(config, {
          directives: [
            ['fails=(.*)', (matches, info) => matches.slice(1).forEach(match => {
              if (info.hasOwnProperty('expectedOutput')) {
                throw error('cannot have "fails" and "output" together');
              }
              info.failReason = match;
            })],
            ['output=(.*)', (matches, info) => matches.slice(1).forEach(match => {
              if (info.hasOwnProperty('failReason')) {
                throw error('cannot have "fails" and "output" together');
              }
              info.expectedOutput = matches[1].replace(/\\n/g, '\n');
            })]
          ]
        });
        const parsed = await parseCode(content.replace(/<br\/>/g, ''), language, config);
        if (!parsed) {
          return []
        }
        parsed.line = line;
        return [parsed];
      })));
};

const parseMarkdownFile = async (path, config = {}) => {
  try {
    const markdown = await promises.readFile(path, 'utf-8');
    const parsed = await parseMarkdown(markdown, config);
    return parsed.map(codeInfo => {
      codeInfo.path = `${path}:${codeInfo.line}`;
      delete codeInfo.line;
      return codeInfo;
    });
  } catch (err) {
    if (err instanceof ParseError) {
      throw new ParseError(`${path}:${err.message}`)
    } else {
      throw err;
    }
  }
}

const compile = async (info, retryOptions = {}) => {
  const error = (text) => {
    return `${info.path}:\n${text}`;
  };
  const failureMismatch = (output) => {
    return new CompileError(-1, error(`should have failed with '${info.failReason}'${output.length > 0 ? `\nactual output is:\n${output}` : ''}`));
  };
  if (info.failReason) {
    try {
      const result = await origCompile(info, retryOptions);
      throw failureMismatch(result);
    } catch (err) {
      if (!err.message.includes(info.failReason)) {
        throw failureMismatch(err.message);
      }
      return err.message;
    }
  } else {
    const result = await (async () => {
      try {
        return await origCompile(info, retryOptions);
      } catch (err) {
        const code = err.hasOwnProperty('code') ? err.code : -2;
        throw new CompileError(err.code, error(err.message));
      }
    })();

    if (info.hasOwnProperty('expectedOutput') && !result.includes(info.expectedOutput)) {
      throw new CompileError(-3, error(`output mismatch:\nactual: ${result}\nexpected: ${info.expectedOutput}`));
    }

    return result;
  }
};

export { parseMarkdown, parseMarkdownFile, compile, CompileError };
