Reveal.on('ready', event => {
  const clickName = (() => {
    const UA = navigator.userAgent;
    const isMobile = /(iphone|ipod|ipad|android)/gi.test(UA) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS

    if (isMobile) {
      return "double tap";
    }
    if (navigator.platform.startsWith("Mac")) {
      return "⌘-click";
    }
    return "Ctrl-click";
  })();
  node = document.querySelector('#click-name')
  node.textContent = node.textContent.replace('click', clickName);
});
