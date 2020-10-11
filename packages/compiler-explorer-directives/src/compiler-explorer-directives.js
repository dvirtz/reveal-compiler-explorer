'use strict';

import bent from 'bent';
import promiseRetry from 'promise-retry';
import ansi_colors from 'ansi-colors';
const { unstyle } = ansi_colors;

// https://github.com/highlightjs/highlight.js/blob/master/SUPPORTED_LANGUAGES.md
const langAliases = {
  'cpp': 'c++', 'hpp': 'c++', 'cc': 'c++', 'hh': 'c++', 'h++': 'c++', 'cxx': 'c++', 'hxx': 'c++',
  'ada': 'ada',
  'x86asm': 'assembly',
  'h': 'c',
  'f90': 'fortran', 'f95': 'fortran',
  'golang': 'go',
  'hs': 'haskell',
  'nimrod': 'nim',
  'ml': 'ocaml',
  'py': 'python', 'gyp': 'python',
  'rs': 'rust'
};

const langConfig = {
  'c++': {
    compiler: 'g102',
    options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
    mainRegex: /\bmain\(/
  },
  'd': {
    compiler: 'ldc1_23',
    mainRegex: /\bmain\(/
  }
}

const defaultConfig = {
  runMain: true,
  useLocal: false,
  localPort: 10240,
  directives: []
};

const directive = pattern => new RegExp(`^\\s*\\/\\/\\/\\s*${pattern}$`);

const builtinDirectives = [
  ['compiler=(.*)', (matches, info) => matches.slice(1).forEach(match => {
    info.compiler = match;
  })],
  ['options=(.*)', (matches, info) => matches.slice(1).forEach(match => info.options = match)],
  ['options\\+=(.*)', (matches, info) => matches.slice(1).forEach(match => info.options += ' ' + match)],
  ['libs=(\\w+:\\w+(?:,\\w+:\\w+)*)', (matches, info) => matches.slice(1).forEach(match => {
    [...match.matchAll(/(\w+):(\w+)/g)].forEach(match => {
      info.libs.push({
        name: match[1],
        ver: match[2]
      });
    })
  })],
  ['(no)?execute', (matches, info) => matches.slice(1).forEach(match => info.execute = !match)],
  ['external', (matches, info) => matches.forEach(_ => info.forceExternal = true)],
  ['(un)?hide', (matches, info) => matches.slice(1).forEach(match => info.hide = !match)],
];

const parseCode = (code, language, config) => {
  language = langAliases[language] || language;
  config = Object.assign({}, defaultConfig, langConfig[language], config);
  const directives = builtinDirectives.concat(config.directives)
    .map(([regex, action]) => [directive(regex), action]);
  const lines = unescape(code).split('\n');
  const matches = (line, regex) => line.match(regex) || [];

  const info = {
    source: [],
    displaySource: [],
    language: language,
    compiler: config.compiler,
    options: config.options || '',
    libs: config.libs || [],
    forceExternal: false,
    hide: false
  };

  for (const line of lines) {
    if (line.match(directive('.*'))) {
      directives.forEach(([regex, action]) => action(matches(line, regex), info))
    } else {
      if (config.runMain && line.match(config.mainRegex) && !info.hasOwnProperty('execute')) {
        info.execute = true;
      }
      info.source.push(line);
      if (!info.hide)
        info.displaySource.push(line);
    }
  }

  info.baseUrl = (config.useLocal && !info.forceExternal)
    ? `http://localhost:${config.localPort}/`
    : 'https://godbolt.org/';
  info.source = info.source.join('\n');
  info.displaySource = info.displaySource.join('\n');
  delete info.hide;
  delete info.forceExternal;

  return info;
};

const displayUrl = (info) => {
  let content = [
    {
      type: 'component',
      componentName: 'codeEditor',
      componentState: {
        id: 1,
        source: info.source,
        options: { compileOnChange: true, colouriseAsm: true },
        fontScale: 2.5
      }
    },
    {
      type: 'column',
      content: [{
        type: 'component',
        componentName: 'compiler',
        componentState: {
          source: 1,
          lang: info.language,
          compiler: info.compiler,
          options: info.options,
          libs: info.libs,
          fontScale: 3.0,
          filters: {
            commentOnly: true,
            directives: true,
            intel: true,
            labels: true,
            trim: true,
            execute: info.execute
          }
        }
      }, {
        type: 'component',
        componentName: 'output',
        componentState: {
          compiler: 1
        }
      }
      ]
    }
  ];
  let obj = {
    version: 4,
    content: [{ type: 'row', content: content }],
    settings: {
      theme: 'dark'
    }
  };

  let ceFragment = encodeURIComponent(JSON.stringify(obj));

  return `${info.baseUrl}#${ceFragment}`;
};

class CompileError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'CompileError';
    this.code = code;
  }
}

const compile = async (info, retryOptions = {}) => {
  const data = {
    source: info.source,
    options: {
      userArguments: info.options || '',
      filters: {
        execute: info.execute || false
      },
      libraries: (info.libs || []).map(function (lib) {
        return {
          id: lib.name,
          version: lib.ver
        };
      })
    }
  };
  const post = bent(info.baseUrl, 'POST', 'json');
  const response = await promiseRetry(retryOptions, async (retry) => {
    try {
      return post(`api/compiler/${info.compiler}/compile`, data);
    }
    catch (err) {
      if (Math.trunc(err.statusCode / 100) === 5) {
        retry(err);
      }

      throw err;
    }
  });

  const text = (stream) => unstyle(stream.map(x => x.text).join('\n'));
  const error = (stream) => {
    if (info.hasOwnProperty('path')) {
      return `${info.path}:\n${text(stream)}`;
    }

    return text(stream);
  };

  if (response.code === 0) {
    if (info.execute) {
      if (response.execResult.code === 0) {
        return text(response.execResult.stdout);
      }

      throw new CompileError(response.execResult.code, error(response.execResult.buildResult.stderr.concat(response.execResult.stderr)));
    }

    return text(response.stdout);
  }

  throw new CompileError(response.code, error(response.stderr));
};

export { parseCode, displayUrl, compile, CompileError };
