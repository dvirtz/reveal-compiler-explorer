A [Reveal.js](https://revealjs.com/) plugin for opening up code snippets on [Compiler Explorer](https://godbolt.org).

[Check out the live demo](https://dvirtz.github.io/reveal-compiler-explorer).

---

## Installation

### npm

1. Download and install the package in your project:

`npm install --save reveal-compiler-explorer`

2. Add the plugins to the dependencies in your presentation

```html
<script src="node_modules/reveal-compiler-explorer/reveal-compiler-explorer.js"></script>
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

1. Copy the file `packages/reveal-compiler-explorer/reveal-compiler-explorer.js` into the plugin folder of your reveal.js presentation, i.e. `plugin/reveal-compiler-explorer`.

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

----

## Configuration

To configure the plugin pass a `compilerExplorer` object to `Reveal.initialize` with any of the following options:

### compiler

Compiler to use when there's no `compiler` directive. Defaults to `g102`.

### options

Compiler options to pass when there's no `options` directive. Defaults to `-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter`.

### runMain

Whether to always run code with `main` functions. Defaults to `false`.

### useLocal

Whether to use a local running instance of Compiler Explorer when presentation is run on `localhost` (might speed up processing).

### localPort

Port of local running Compiler Explorer, in case `useLocal` is `true`. Defaults to `10240`.