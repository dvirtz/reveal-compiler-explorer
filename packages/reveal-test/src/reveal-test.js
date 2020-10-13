'use strict';

import { parseCode, compile as origCompile, CompileError } from 'compiler-explorer-directives';
import MarkdownIt from 'markdown-it';
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import assert from 'assert';

const parseMarkdownImpl = (path, markdown, config) => {
  const md = new MarkdownIt();
  const result = md.parse(markdown, {});
  return result
    .filter(({ type, tag }) => type === 'fence' && tag === 'code')
    .map(({ content, info, map }) => {
      config = Object.assign(config, {
        directives:
          [['fails=(.*)', (matches, info) => matches.slice(1).forEach(match => info.failReason = match)]]
      });
      const parsed = parseCode(content.replace(/<br\/>/g, ''), info.replace(/(\w+).*/, '$1'), config);
      parsed.path = `${path}:${map[0] + 1}`;
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
    } catch(err) {
      if (!err.message.includes(info.failReason)) {
        throw failureMismatch(err.message);
      }
      return err.message;
    }
  } else {
    try {
      return await origCompile(info);
    } catch (err) {
      const code = err.hasOwnProperty('code') ? err.code : -2;
      throw new CompileError(err.code, error(err.message));
    }
  }
};

export { parseMarkdown, parseMarkdownSync, compile, CompileError };
