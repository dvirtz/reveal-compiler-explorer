// code to bypass https://github.com/hakimel/reveal.js/issues/2744

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

const CODE_LINE_NUMBER_REGEX = /\[([\s\d,|-]*)\]/;

function escapeForHTML(input) {
  return input.replace(/([&<>'"])/g, char => HTML_ESCAPE_MAP[char]);
}

markdownPlugin = RevealMarkdown();

origInit = markdownPlugin.init;

markdownPlugin.init = function (reveal) {

  var result = origInit(reveal);

  let renderer = new this.marked.Renderer();

  renderer.code = (code, language) => {

    // Off by default
    let lineNumbers = '';

    // Users can opt in to show line numbers and highlight
    // specific lines.
    // ```javascript []        show line numbers
    // ```javascript [1,4-8]   highlights lines 1 and 4-8
    if (CODE_LINE_NUMBER_REGEX.test(language)) {
      lineNumbers = language.match(CODE_LINE_NUMBER_REGEX)[1].trim();
      lineNumbers = `data-line-numbers="${lineNumbers}"`;
      language = language.replace(CODE_LINE_NUMBER_REGEX, '').trim();
    }

    // Escape before this gets injected into the DOM to
    // avoid having the HTML parser alter our code before
    // highlight.js is able to read it
    code = escapeForHTML(code);

    return `<pre><code ${lineNumbers} class="${language}">${code}</code></pre>`;
  };

  this.marked.setOptions({
    renderer: renderer
  });

  return result;

};

options.plugins[options.plugins.indexOf(RevealMarkdown)] = () => markdownPlugin;
