# reveal-compiler-explorer

[![npm version](https://badge.fury.io/js/reveal-compiler-explorer.svg)](https://badge.fury.io/js/reveal-compiler-explorer) 
![master](https://github.com/dvirtz/reveal-compiler-explorer/workflows/master/badge.svg)

A [Reveal.js](https://revealjs.com/) plugin for opening up code snippets on [Compiler Explorer](https://godbolt.org).

Check out the [live demo](https://dvirtz.github.io/reveal-compiler-explorer).

For testing presentation code, see [reveal-test](../reveal-test) package.

---

## Installation

### Using a package manager

1. Download and install the package in your project:

    ```
    npm install --save reveal-compiler-explorer
    ```

    or

    ```
    yarn add reveal-compiler-explorer
    ```

2. Add the plugins to the dependencies in your presentation

    ```html
    <script src="node_modules/reveal-compiler-explorer/dist/reveal-compiler-explorer.js"></script>
    ```

    ```javascript
    // ...
    Reveal.initialize({
      // ...
      plugins: [
        // ...
        RevealCompilerExplorer,
        // ...
      ]
    });
    ```

### Manual

1. Download [dist/reveal-compiler-explorer.js](dist/reveal-compiler-explorer.js) into the plugin folder of your reveal.js presentation, i.e. `plugin/reveal-compiler-explorer`.

2. Add the plugins to the dependencies in your presentation

    ```html
    <script src="plugin/reveal-compiler-explorer/reveal-compiler-explorer.js"></script>
    ```

    ```javascript
    // ...
    Reveal.initialize({
      // ...
      plugins: [
        // ...
        RevealCompilerExplorer,
        // ...
      ]
    });
    ```

---

## Configuration

To configure the plugin pass a `compilerExplorer` object to `Reveal.initialize` with any of the options from [here](../compiler-explorer-directives/#Configuration).

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

In addition to the directives mentioned [here](../compiler-explorer-directives/#Directives), the following directives are supported:

### `///hide`

Hides the following code, until the next `///unhide` or end of the snippet, from presentation.

### `///unhide`

Revert code hiding.

The directives will not be shown on the presentation.