# compiler-explorer-directives

[![npm version](https://badge.fury.io/js/compiler-explorer-directives.svg)](https://badge.fury.io/js/compiler-explorer-directives) 
![master](https://github.com/dvirtz/reveal-compiler-explorer/workflows/master/badge.svg)

Interact with [Compiler Explorer](https://godbolt.org) links using inline code directives.

Base'd on Matt Godbolt's code which can be found at [here](https://github.com/mattgodbolt/cpponsea-2019/blob/445506387c9ec63ad018b75af77a5feaa3dc2a17/compiler-explorer.js).

## Example

```js
import {parseCode, displayURL} from 'compiler-explorer-directives';
const info = parseCode(`
///compiler=g83
///options+=-O0
#include <iostream>

int main() {
  std::cout << "Hello CE!";
}`, cpp);
const url = displayURL(info);
```

## API

### parseCode

```js
parseCode(code, language, config)
```

Parses code according to [directives](#directives) and generates an info object which can then be passed to [`displayUrl`](#displayUrl) and [`compile`](#compile).

`language` should be one of CE's [support languages](https://github.com/compiler-explorer/compiler-explorer/blob/master/lib/languages.js).

`config` is optional, and should be an object with fields listed under [Configuration](#configuration).

### displayUrl

```js
displayUrl(info)
```

Generates a URL which opens CE with the code parsed by [`parseCode`](#parseCode).

### compile

```js
compile(info)
```

Calls CE's Rest API to compile the code parsed by [`parseCode`](#parseCode).

Returns output from compiling and running the code (if enabled) on success, otherwise throws `CompileError` with `code` being the exit code and `message` being the compiler's error message.

---

## Directives

Use `///` directives to configure a specific code snippet. Every line starting with `///`, which is not mapped to one of the supported directives, is ignored.

### `///compiler=<compiler>`

Override default compiler.

### `///options=<options>`

Override default options.

### `///options+=<options>`

Add to default options.

### `///libs=<lib:version>[,lib:version...]`

Use libraries in snippet.

### `///execute`

Run the compiled output.

### `///external`

Always open on `godbolt.com` even if [`useLocal`](#useLocal) is set.

---

## Configuration

To configure the plugin pass a `compilerExplorer` object to `Reveal.initialize` with any of the following options:

### compiler

Compiler to use when there's no `compiler` directive. Defaults to `g102`.

### options

Compiler options to pass when there's no `options` directive. Defaults to `-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter`.

### runMain

Whether to always run code with `main` functions. Defaults to `false`.

### useLocal

Whether to use a local running instance of Compiler Explorer (might speed up processing).

### localPort

Port of local running Compiler Explorer, in case `useLocal` is `true`. Defaults to `10240`.

### directives

User defined directives. Needs to be an array of `[regex, action]` pairs where `action` is a function accepting `matches` and `info` with the `regex`'s matches and current info instance, respectively.
