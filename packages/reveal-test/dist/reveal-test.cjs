'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var compilerExplorerDirectives = require('compiler-explorer-directives');
var MarkdownIt = require('markdown-it');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var MarkdownIt__default = /*#__PURE__*/_interopDefaultLegacy(MarkdownIt);

const parseMarkdownImpl = async (markdown, path, config = {}) => {
  const md = new MarkdownIt__default['default']();
  const result = md.parse(markdown, {});
  return []
    .concat
    .apply([], await Promise.all(result
      .filter(({ type, tag }) => type === 'fence' && tag === 'code')
      .flatMap(async ({ content, info, map }) => {
        const [location, error] = (() => {
          if (path) {
            return [`${path}:${map[0] + 1}`, message => new Error(`${location}:\n${message}`)];
          }
          return [undefined, message => new Error(message)];
        })();
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
        const parsed = await compilerExplorerDirectives.parseCode(content.replace(/<br\/>/g, ''), info.replace(/(\w+).*/, '$1'), config);
        if (!parsed) {
          return []
        }
        if (parsed && location) {
          parsed.path = location;
        }
        return [parsed];
      })));
};

const parseMarkdown = async (path, config = {}) => {
  const markdown = await fs.promises.readFile(path, 'utf-8');
  return await parseMarkdownImpl(markdown, path, config);
};

const compile = async (info, retryOptions = {}) => {
  const error = (text) => {
    return `${info.path}:\n${text}`;
  };
  const failureMismatch = (output) => {
    return new compilerExplorerDirectives.CompileError(-1, error(`should have failed with '${info.failReason}'${output.length > 0 ? `\nactual output is:\n${output}` : ''}`));
  };
  const resultPromise = compilerExplorerDirectives.compile(info, retryOptions);
  if (info.failReason) {
    try {
      const result = await resultPromise;
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
        return await resultPromise;
      } catch (err) {
        const code = err.hasOwnProperty('code') ? err.code : -2;
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
//# sourceMappingURL=reveal-test.cjs.map
