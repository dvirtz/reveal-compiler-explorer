'use strict';

import { parseCode, compile, CompileError } from 'compiler-explorer-directives';
import MarkdownIt from 'markdown-it';
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';

const parseMarkdownImpl = (path, markdown, config) => {
  const md = new MarkdownIt();
  const result = md.parse(markdown, {});
  return result
    .filter(({ type, tag }) => type === 'fence' && tag === 'code')
    .map(({ content, info, map }) => {
      config = Object.assign(config, {
        directives:
          [['fails=(.*)', (matches, info) => matches.slice(1).forEach(match => info.failReason = new RegExp(match))]]
      });
      const parsed = parseCode(content.replace(/<br\/>/g, ''), info, config);
      if (typeof path == 'string') {
        parsed.path = `${path}:${map[0] + 1}`;
      }
      return parsed;
    });
};

const parseMarkdown = async (path, config = {}) => {
  const markdown = await readFile(path, 'utf-8');
  return parseMarkdownImpl(path, markdown, config);
}

const parseMarkdownSync = (path, config = {}) => {
  const markdown = readFileSync(path, 'utf-8');
  return parseMarkdownImpl(path, markdown, config);
}

export { parseMarkdown, parseMarkdownSync, compile, CompileError }
