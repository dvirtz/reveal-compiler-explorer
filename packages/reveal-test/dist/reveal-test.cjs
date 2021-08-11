'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var compilerExplorerDirectives = require('compiler-explorer-directives');
var MarkdownIt = require('markdown-it');
var fs = require('fs');
var cheerio = require('cheerio');
var dedent = require('dedent');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var MarkdownIt__default = /*#__PURE__*/_interopDefaultLegacy(MarkdownIt);
var cheerio__default = /*#__PURE__*/_interopDefaultLegacy(cheerio);
var dedent__default = /*#__PURE__*/_interopDefaultLegacy(dedent);

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
};

const parseMarkdown = async (markdown, config = {}) => {
  const md = new MarkdownIt__default['default']({ html: true, breaks: true });
  const result = md.parse(markdown, {});
  const codeBlocks = result
    .filter(({ type, tag }) => type === 'fence' && tag === 'code')
    .map(({ content, info, map }) => { return { content: content, language: info.replace(/(\w+).*/, '$1'), line: map[0] + 1 }; })
    .concat(result
      .filter(({ type }) => type === 'html_block').flatMap(({ content, info, map }) => {
        const $ = cheerio__default['default'].load(content);
        return $('pre code').map(function (index) {
          return {
            content: dedent__default['default']($(this).text().replace(/(\n)/g, '$1 ')),
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
        const parsed = await compilerExplorerDirectives.parseCode(content.replace(/<br\/>/g, ''), language, config);
        if (!parsed) {
          return []
        }
        parsed.line = line;
        return [parsed];
      })));
};

const parseMarkdownFile = async (path, config = {}) => {
  try {
    const markdown = await fs.promises.readFile(path, 'utf-8');
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
};

const compile = async (info, retryOptions = {}) => {
  const error = (text) => {
    return `${info.path}:\n${text}`;
  };
  const failureMismatch = (output) => {
    return new compilerExplorerDirectives.CompileError(-1, error(`should have failed with '${info.failReason}'${output.length > 0 ? `\nactual output is:\n${output}` : ''}`));
  };
  if (info.failReason) {
    try {
      const result = await compilerExplorerDirectives.compile(info, retryOptions);
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
        return await compilerExplorerDirectives.compile(info, retryOptions);
      } catch (err) {
        err.hasOwnProperty('code') ? err.code : -2;
        throw new compilerExplorerDirectives.CompileError(err.code, error(err.message));
      }
    })();

    if (info.hasOwnProperty('expectedOutput') && !result.includes(info.expectedOutput)) {
      throw new compilerExplorerDirectives.CompileError(-3, error(`output mismatch:\nactual: ${result}\nexpected: ${info.expectedOutput}`));
    }

    return result;
  }
};

Object.defineProperty(exports, 'CompileError', {
  enumerable: true,
  get: function () {
    return compilerExplorerDirectives.CompileError;
  }
});
exports.compile = compile;
exports.parseMarkdown = parseMarkdown;
exports.parseMarkdownFile = parseMarkdownFile;
//# sourceMappingURL=reveal-test.cjs.map
