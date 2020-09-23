const directive = pattern => new RegExp(`^\s*\/\/\/\s*${pattern}$`);

const directives = new Map([
  ['compiler=(.*)', (matches, info) => matches.slice(1).forEach(match => {
    info.compiler = match;
    info.forceExternal = true;
    if (info.compiler.includes('vcpp')) {
      info.options = ''
    }
  })],
  ['options=(.*)', (matches, info) => matches.slice(1).forEach(match => info.options += ' ' + match)],
  ['libs=(\\w+:\\w+(?:,\\w+:\\w+)*)', (matches, info) => matches.slice(1).forEach(match => {
    [...match.matchAll(/(\w+):(\w+)/g)].forEach(match => {
      info.libs.push({
        name: match[1],
        ver: match[2]
      });
    })
  })],
  ['execute', (matches, info) => matches.forEach(_ => info.execute = true)],
  ['external', (matches, info) => matches.forEach(_ => info.forceExternal = true)],
  ['fails=(.*)', (matches, info) => matches.slice(1).forEach(match => info.failReason = match)],
  ['((un)?hide)', (matches, info) => matches.slice(1, 2).forEach(match => info.hide = match == 'hide')]
].map(([regex, action]) => [directive(regex), action]));

const processElement = (content, isLocal = false) => {
  let defaultCompiler = 'g83';
  let defaultOptions = '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter';
  let lines = unescape(content).split('\n');
  let displaySource = '';
  let matches = (line, regex) => line.match(regex) || [];
  let skipDisplay = false;

  const info = {
    source: '',
    compiler: defaultCompiler,
    options: defaultOptions,
    libs: [],
    execute: false,
    forceExternal: false,
    failReason: '',
    hide: false
  };

  for (line of lines) {
    if (line.startsWith('///')) {
      directives.forEach((action, regex) => action(matches(line, regex), info))
    } else {
      matches(line, /int main/).forEach(_ => info.execute = true)
      info.source += line + '\n';
      if (!skipDisplay && !info.hide)
        displaySource += line + '\n';
    }
  }

  delete info.hide;

  return [info, displaySource]
};

function prepareUrl(info, isLocal) {
  function trim(source) {
    while (source.startsWith('\n')) {
      source = source.slice(1, source.length);
    }
    while (source.endsWith('\n\n')) {
      source = source.slice(0, source.length - 1);
    }
    return source;
  }

  let content = [
    {
      type: 'component',
      componentName: 'codeEditor',
      componentState: {
        id: 1,
        source: trim(info.source),
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
          lang: 'c++',
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

  const baseUrl = (isLocal && !info.forceExternal) ? 'http://localhost:10240/' : 'https://godbolt.org/';

  let ceFragment = encodeURIComponent(JSON.stringify(obj));

  return `${baseUrl}#${ceFragment}`;
};

const RevealCompilerExplorer = {
  id: 'compiler-explorer',
  init: function (reveal) {
    const highlighPlugin = reveal.getPlugin('highlight');
    const highlightConfig = reveal.getConfig().highlight || {};
    const highlightOnLoad = typeof highlightConfig.highlightOnLoad === 'boolean' ? highlightConfig.highlightOnLoad : true;
    const isLocal = !!window.location.host.match(/localhost/gi);
    [].slice.call(reveal.getRevealElement().querySelectorAll('pre code')).forEach(function (block) {
      const [info, displaySource] = processElement(block.textContent, isLocal)
      const url = prepareUrl(info, isLocal);
      block.parentNode.onclick = (evt) => {
        if (evt.ctrlKey || evt.metaKey) {
          window.open(url, 'ce');
        }
      };
      block.textContent = displaySource;
      if (highlightOnLoad) {
        highlighPlugin.highlightBlock(block);
      }
    });
  }
};

window.RevealCompilerExplorer = window.RevealCompilerExplorer || RevealCompilerExplorer;
