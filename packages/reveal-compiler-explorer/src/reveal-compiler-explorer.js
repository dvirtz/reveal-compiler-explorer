import { parseCode, displayUrl, compile, getLanguage } from 'compiler-explorer-directives';
import Hammer from 'hammerjs';
import { isMobile } from 'reveal.js/js/utils/device';

async function parseBlock(block, config) {
  // highlighting line numbers removes line break so we need to restore them
  const code = block.hasAttribute('data-line-numbers') && block.classList.contains('hljs')
    ? Array.from(block.querySelectorAll('tr').values()).map(v => v.textContent).join('\n')
    : block.textContent;
  const info = await parseCode(code, block.classList, config);
  if (!info) {
    return;
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

  block.textContent = info.displaySource;
}

export default {
  id: 'compiler-explorer',
  init: (reveal) => {
    const highlighPlugin = reveal.getPlugin('highlight');
    const highlightConfig = reveal.getConfig().highlight || {};
    const highlightOnLoad = typeof highlightConfig.highlightOnLoad === 'boolean' ? highlightConfig.highlightOnLoad : true;
    const config = reveal.getConfig().compilerExplorer;

    return Promise.all([].slice.call(reveal.getRevealElement().querySelectorAll('pre code')).map(async (block) => {
      await parseBlock(block, config);
      if (highlightOnLoad) {
        highlighPlugin.highlightBlock(block);
      }
    }));
  },
  compile: compile
};
