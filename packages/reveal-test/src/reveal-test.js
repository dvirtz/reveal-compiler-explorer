'use strict';

const { parseCode, compile: origCompile, CompileError } = require('compiler-explorer-directives');
const MarkdownIt = require('markdown-it');
const { promises } = require('fs');
const cheerio = require('cheerio');
const dedent = require('dedent-js');
const fetch = require('cross-fetch');

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
    .filter(({ content }) => content.trim() !== '') // remove empty code blocks
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
  await replaceUrlIncludes(info);
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

// https://stackoverflow.com/a/48032528/621176
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

async function replaceUrlIncludes(info) {
  const includeFind = /^\s*#\s*include\s*["<](https?:\/\/[^">]+)[">]/mg;
  const downloadedIncludes = (function () {
    if (typeof replaceUrlIncludes.downloadedIncludes == 'undefined') {
      replaceUrlIncludes.downloadedIncludes = new Map();
    }
    return replaceUrlIncludes.downloadedIncludes;
  })();
  info.source = await replaceAsync(info.source, includeFind, async (match, p1) => {
    if (!downloadedIncludes.has(p1)) {
      try {
        downloadedIncludes.set(p1, await (await fetch(p1)).text());
      } catch (err) {
        throw CompileError(-5, `${info.path}: failed downloading ${p1}: ${err.message}`);
      }
    }

    return downloadedIncludes.get(p1);
  });
};

module.exports = { parseMarkdown, parseMarkdownFile, compile, CompileError };
