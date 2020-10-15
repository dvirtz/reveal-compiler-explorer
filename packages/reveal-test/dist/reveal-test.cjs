'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var compilerExplorerDirectives = require('compiler-explorer-directives');
var MarkdownIt = require('markdown-it');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var MarkdownIt__default = /*#__PURE__*/_interopDefaultLegacy(MarkdownIt);

const parseMarkdownImpl = (path, markdown, config) => {
  const md = new MarkdownIt__default['default']();
  const result = md.parse(markdown, {});
  return result
    .filter(({ type, tag }) => type === 'fence' && tag === 'code')
    .map(({ content, info, map }) => {
      config = Object.assign(config, {
        directives:
          [['fails=(.*)', (matches, info) => matches.slice(1).forEach(match => info.failReason = match)]]
      });
      const parsed = compilerExplorerDirectives.parseCode(content.replace(/<br\/>/g, ''), info.replace(/(\w+).*/, '$1'), config);
      parsed.path = `${path}:${map[0] + 1}`;
      return parsed;
    });
};

const parseMarkdown = async (path, config = {}) => {
  const markdown = await fs.promises.readFile(path, 'utf-8');
  return parseMarkdownImpl(path, markdown, config);
};

const parseMarkdownSync = (path, config = {}) => {
  const markdown = fs.readFileSync(path, 'utf-8');
  return parseMarkdownImpl(path, markdown, config);
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
    } catch(err) {
      if (!err.message.includes(info.failReason)) {
        throw failureMismatch(err.message);
      }
      return err.message;
    }
  } else {
    try {
      return await compilerExplorerDirectives.compile(info);
    } catch (err) {
      const code = err.hasOwnProperty('code') ? err.code : -2;
      throw new compilerExplorerDirectives.CompileError(err.code, error(err.message));
    }
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
exports.parseMarkdownSync = parseMarkdownSync;
