# reveal-compiler-explorer

[![npm version](https://badge.fury.io/js/reveal-compiler-explorer.svg) ![npm](https://img.shields.io/npm/dt/reveal-compiler-explorer)](https://www.npmjs.com/package/reveal-compiler-explorer) 
[![publish](https://github.com/dvirtz/reveal-compiler-explorer/workflows/publish/badge.svg)](https://github.com/dvirtz/reveal-compiler-explorer/actions?query=workflow%3Apublish)

A [Reveal.js](https://revealjs.com/) plugin for opening code snippets in [Compiler Explorer](https://godbolt.org) by clicking on them.

Check out the [live demo](https://dvirtz.github.io/reveal-compiler-explorer).

For testing presentation code, see [reveal-test](/packages/reveal-test) package.

---

## Installation

1. Download and install the package in your project:

    ```
    npm install --save reveal-compiler-explorer
    ```

    or

    ```
    yarn add reveal-compiler-explorer
    ```

    or just download [dist/reveal-compiler-explorer.js](/packages/reveal-compiler-explorer/dist/reveal-compiler-explorer.js) into the plugin folder of your reveal.js presentation, e.g.. `plugins/reveal-compiler-explorer`.

2. Add the plugins to the dependencies in your presentation

    ```html
    <script src="node_modules/reveal-compiler-explorer/dist/reveal-compiler-explorer.js"></script>
    ```

    ```javascript
    // ...
    Reveal.initialize({
      // ...
      plugins: [
          RevealMarkdown,
          RevealCompilerExplorer,
          RevealHighlight,
      ]
    });
    ```

    Note that the plugin should come before the highlight plugin.

    If you're using [reveal-md](https://github.com/webpro/reveal-md) you can add a script to load the plugin:

    ```js
    options.plugins.splice(options.plugins.indexOf(RevealHighlight), 0, RevealCompilerExplorer);
    ```

    and then add a reference to this script along with `node_modules/reveal-compiler-explorer/dist/reveal-compiler-explorer.js` to the `scripts` object inside `reveal-md.json` config file. 

For reference, take a look at the [demo](/packages/reveal-compiler-explorer-demo) package in this repo.


---

## Configuration

To configure the plugin pass a `compilerExplorer` object to `Reveal.initialize` with any of the options from [here](/packages/compiler-explorer-directives/#Configuration).

For example

```javascript
// ...
Reveal.initialize({
  // ...
  plugins: [
    // ...
    RevealCompilerExplorer
    // ...
  ],
  // ...
  compilerExplorer: {
    compiler: "g83",
    runMain: false
  }
});
```

---

## Directives

In addition to the directives mentioned [here](/packages/compiler-explorer-directives/#Directives), the following directives are supported:

### `///hide`

Hides the following code, until the next `///unhide` or end of the snippet, from presentation.

### `///unhide`

Revert code hiding.

The directives will not be shown on the presentation.
