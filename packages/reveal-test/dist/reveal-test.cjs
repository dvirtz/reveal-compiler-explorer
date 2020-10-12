'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var compilerExplorerDirectives = require('compiler-explorer-directives');
var MarkdownIt = require('markdown-it');
var fs = require('fs');
var promises = require('fs/promises');

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
          [['fails=(.*)', (matches, info) => matches.slice(1).forEach(match => info.failReason = new RegExp(match))]]
      });
      const parsed = compilerExplorerDirectives.parseCode(content.replace(/<br\/>/g, ''), info, config);
      if (typeof path == 'string') {
        parsed.path = `${path}:${map[0] + 1}`;
      }
      return parsed;
    });
};

const parseMarkdown = async (path, config = {}) => {
  const markdown = await promises.readFile(path, 'utf-8');
  return parseMarkdownImpl(path, markdown, config);
};

const parseMarkdownSync = (path, config = {}) => {
  const markdown = fs.readFileSync(path, 'utf-8');
  return parseMarkdownImpl(path, markdown, config);
};

Object.defineProperty(exports, 'CompileError', {
  enumerable: true,
  get: function () {
    return compilerExplorerDirectives.CompileError;
  }
});
Object.defineProperty(exports, 'compile', {
  enumerable: true,
  get: function () {
    return compilerExplorerDirectives.compile;
  }
});
exports.parseMarkdown = parseMarkdown;
exports.parseMarkdownSync = parseMarkdownSync;
