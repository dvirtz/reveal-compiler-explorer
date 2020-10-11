var RevealCompilerExplorer = (function (compilerExplorerDirectives) {
  'use strict';

  var revealCompilerExplorer = {
    id: 'compiler-explorer',
    init: (reveal) => {
      const highlighPlugin = reveal.getPlugin('highlight');
      const highlightConfig = reveal.getConfig().highlight || {};
      const highlightOnLoad = typeof highlightConfig.highlightOnLoad === 'boolean' ? highlightConfig.highlightOnLoad : true;

      [].slice.call(reveal.getRevealElement().querySelectorAll('pre code')).forEach(function (block) {
        const lang = block.classList.length > 0 ? block.classList[0].replace('language-', '') : config.language;
        const config = reveal.getConfig().compilerExplorer;
        const info = compilerExplorerDirectives.parseCode(block.textContent, lang, config);
        const url = compilerExplorerDirectives.displayUrl(info);
        block.parentNode.onclick = (evt) => {
          if (evt.ctrlKey || evt.metaKey) {
            window.open(url, 'ce');
          }
        };
        block.textContent = info.displaySource;
        if (highlightOnLoad) {
          highlighPlugin.highlightBlock(block);
        }
      });
    },
    compile: compilerExplorerDirectives.compile
  };

  return revealCompilerExplorer;

}(compilerExplorerDirectives));
//# sourceMappingURL=reveal-compiler-explorer.js.map
