'use strict';

const promiseRetry = require('promise-retry');
const ansi_colors = require('ansi-colors');
const debug = require('debug');
const fetch = require('cross-fetch');
const { unstyle } = ansi_colors;
const CompileError = require('./compile-error')

const log = debug('reveal-compiler-explorer:compiler-explorer-directives');

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

const GODBOLT_URL = 'https://godbolt.org';

const checked = (response) => {
  if (response.ok) {
    return response;
  }

  throw CompileError(response.status, response.statusText);
};

async function languages() {
  try {
    log(`reading languages from ${GODBOLT_URL}`);
    const response = await fetch(`${GODBOLT_URL}/api/languages?fields=id,defaultCompiler`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return await checked(response).json();
  } catch (error) {
    log(`error while reading languages: ${error.message}`);
    return [
      {
        "id": "c++",
        "defaultCompiler": "g122"
      }
    ];
  }
}

const langConfig = (() => {
  let langConfig;
  return async function () {
    if (!langConfig) {
      const predefined = new Map([
        ['c++', {
          options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
          mainRegex: /\bmain\(/
        }],
        ['c', {
          options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
          mainRegex: /\bmain\(/
        }],
        ['d', {
          mainRegex: /\bmain\(/
        }]
      ]);
      langConfig = new Map((await languages())
        .map(({ id, defaultCompiler }) => [id, Object.assign({ 'compiler': defaultCompiler }, predefined.get(id))]));
      log('default language configuration is %o', langConfig);
    }
    return langConfig;
  };
})();

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

const parseCode = async (code, language, config) => {
  log('parsing %o, language %s, config %o', code, language, config);
  const lc = await langConfig();
  language = getLanguage(language, lc, config && config.language);
  if (!lc.has(language)) {
    log('language %s is not supported', language);
    return null;
  }

  config = Object.assign({}, defaultConfig, lc.get(language), config, config && config[language]);
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
      if (config.runMain
        && config.mainRegex
        && line.match(config.mainRegex)
        && !info.hasOwnProperty('execute')) {
        info.execute = true;
      }
      info.source.push(line);
      if (!info.hide)
        info.displaySource.push(line);
    }
  }

  info.baseUrl = (config.useLocal && !info.forceExternal)
    ? `http://localhost:${config.localPort}`
    : GODBOLT_URL;
  info.source = info.source.join('\n');
  info.displaySource = info.displaySource.join('\n');
  delete info.hide;
  delete info.forceExternal;

  log('parse result %o', info);
  return info;
};

const displayUrl = (info) => {
  let content = [
    {
      type: 'component',
      componentName: 'codeEditor',
      componentState: {
        id: 1,
        lang: info.language,
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

  return `${info.baseUrl}/#${ceFragment}`;
};

const compile = async (info, retryOptions = {}) => {
  log('compiling %o', info);
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
  const response = await promiseRetry(retryOptions, async (retry) => {
    const response = await fetch(`${info.baseUrl}/api/compiler/${info.compiler}/compile`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (Math.trunc(response.status / 100) === 5) {
      log(`response status is ${response.status} (${response.statusText}), retrying`);
      retry(response);
    }
    return await checked(response).json();
  });

  log('response is %o', response);

  const text = (stream) => unstyle(stream.stderr.concat(stream.stdout).map(x => x.text).join('\n'));

  if (response.code === 0) {
    if (info.execute) {
      if (response.execResult.buildResult.code === 0) {
        return text(response.execResult);
      }

      throw new CompileError(response.execResult.buildResult.code,
        text(response.execResult.buildResult));
    }

    return text(response);
  }

  throw new CompileError(response.code, text(response));
};

function getLanguage(language, languageConfig, fallback) {
  return language.split(' ')
    .map(lang => lang.replace(/\blang(?:uage)?-([\w-]+)\b/i, '$1'))
    .map(lang => langAliases[lang] || lang)
    .filter(lang => languageConfig.has(lang))
    .concat(fallback)
  [0];
}

module.exports.parseCode = parseCode;
module.exports.displayUrl = displayUrl;
module.exports.compile = compile;
module.exports.CompileError = CompileError;
