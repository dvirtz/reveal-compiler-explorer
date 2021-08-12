import { parseCode, displayUrl, compile, getLanguage } from 'compiler-explorer-directives';
import Hammer from 'hammerjs';
import { isMobile } from 'reveal.js/js/utils/device';

const elementMark = '__REVEAL_CE__';

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

function escapeForHTML(input) {
  return input.replace(/([&<>'"])/g, char => HTML_ESCAPE_MAP[char]);
}

async function parseBlock(block, config) {
  // highlighting line numbers removes line break so we need to restore them
  if (block.classList.contains('hljs')) {
    throw Error('plugin should be run before highlighting');
  }
  const code = (() => {
    if (block.hasChildNodes()) {
      return Array.from(block.childNodes).reduce((code, node) => {
        switch (node.nodeType) {
          case Node.ELEMENT_NODE:
            return code + `${elementMark}${node.tagName}${elementMark}${node.innerText}${elementMark}/${node.tagName}${elementMark}`;
          case Node.TEXT_NODE:
            return code + node.textContent;
          default:
            throw Error(`don't know what to do with inner ${node.tagName}`);
        }
      }, '');
    }
    return block.textContent;
  })();
  const info = await parseCode(code, [block.classList, block.parentNode?.classList].join(' '), config);
  if (!info) {
    return;
  }

  if (info.source.includes(elementMark)) {
    const elementMarkRe = new RegExp(`${elementMark}(.*?)${elementMark}(.*?)${elementMark}\\/\\1${elementMark}`, 'g');
    block.innerHTML = escapeForHTML(info.displaySource).replace(elementMarkRe, '<$1>$2</$1>');
    info.displaySource = info.displaySource.replace(elementMarkRe, '$2');
    info.source = info.source.replace(elementMarkRe, '$2');
  } else {
    block.textContent = info.displaySource;
  }

  const url = displayUrl(info);

  if (isMobile) {
    delete Hammer.defaults.cssProps.userSelect; // keep default behavior
    var hammer = new Hammer.Manager(block.parentNode);
    hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    hammer.on('doubletap', e => {
      window.open(url, 'ce');
    });
  } else {
    block.parentNode.onclick = (evt) => {
      if (evt.ctrlKey || evt.metaKey) {
        window.open(url, 'ce');
      }
    };
  }
}

export default {
  id: 'compiler-explorer',
  init: (reveal) => {
    const config = reveal.getConfig().compilerExplorer;

    return Promise.all([].slice.call(reveal.getRevealElement().querySelectorAll('pre code')).map(async (block) => {
      await parseBlock(block, config);
    }));
  },
  compile: compile
};
