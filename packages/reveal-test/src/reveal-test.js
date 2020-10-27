'use strict';

import { parseCode, compile as origCompile, CompileError } from 'compiler-explorer-directives';
import MarkdownIt from 'markdown-it';
import { readFileSync, promises } from 'fs';

const parseMarkdownImpl = (markdown, path, config = {}) => {
  const md = new MarkdownIt();
  const result = md.parse(markdown, {});
  return result
    .filter(({ type, tag }) => type === 'fence' && tag === 'code')
    .map(({ content, info, map }) => {
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
            info.expectedOutput = matches[1];
          })]
        ]
      });
      const parsed = parseCode(content.replace(/<br\/>/g, ''), info.replace(/(\w+).*/, '$1'), config);
      if (location) {
        parsed.path = location;
      }
      return parsed;
    });
};

const parseMarkdown = async (path, config = {}) => {
  const markdown = await promises.readFile(path, 'utf-8');
  return parseMarkdownImpl(markdown, path, config);
}

const parseMarkdownSync = (path, config = {}) => {
  const markdown = readFileSync(path, 'utf-8');
  return parseMarkdownImpl(markdown, path, config);
}

const compile = async (info, retryOptions = {}) => {
  const error = (text) => {
    return `${info.path}:\n${text}`;
  };
  const failureMismatch = (output) => {
    return new CompileError(-1, error(`should have failed with '${info.failReason}'${output.length > 0 ? `\nactual output is:\n${output}` : ''}`));
  };
  const resultPromise = origCompile(info, retryOptions)
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
        throw new CompileError(err.code, error(err.message));
      }
    })();

    if (info.hasOwnProperty('expectedOutput') && !result.includes(info.expectedOutput)) {
      throw new CompileError(-3, error(`output mismatch:\nactual: ${result}\nexpected: ${info.expectedOutput}`));
    }

    return result;
  }
};

export { parseMarkdown, parseMarkdownSync, compile, CompileError };
