# `reveal-test`

[![npm version](https://badge.fury.io/js/reveal-test.svg) ![npm](https://img.shields.io/npm/dt/reveal-test)](https://www.npmjs.com/package/reveal-test) 
[![publish](https://github.com/dvirtz/reveal-compiler-explorer/workflows/publish/badge.svg)](https://github.com/dvirtz/reveal-compiler-explorer/actions?query=workflow%3Apublish)

Utilities for testing presentation code snippets by compiling them on [Compiler Explorer](https://godbolt.org).

Check out also [reveal-compiler-explorer](/packages/reveal-compiler-explorer) package.

## Example

```js
const { parseMarkdownFile, compile, CompileError } = require('reveal-test');

const codeInfos = await parseMarkdownFile('presentation.md');

describe("demo presentation", function () {
  codeInfo.forEach((info, index) => {
    it(`should have snippet ${index} compiled`, async function () {
      await compile(info);
    });
  });
}, 10000);
```

For reference, take a look at the [demo](/packages/reveal-compiler-explorer-demo) package in this repo.

---

## Installation

```
npm install --save-dev reveal-test
```

or

```
yarn add -D reveal-test
```

---

# API

### parseMarkdownFile

```js
parseMarkdownFile(path: String, config: Config = {}, preprocessor: (String) => String) => Promise<Array<SnippetInfo>>
```

Asynchronously generates a list of all code snippets from a given markdown file. For possible `config` fields, see [here](#configuration).
Optionally pre-processes the markdown file with the given `preprocessor` function.

### parseMarkdown

```js
parseMarkdown(markdown: String, config: Config = {}) => Array<SnippetInfo>
```

Generates a list of all code snippets from a given markdown string. For possible `config` fields, see [here](#configuration).

### compile

```js
compile(info: SnippetInfo) => String
```

Calls CE's Rest API to compile a code snippet.

Returns output from compiling and running the code (if enabled) on success, otherwise throws `CompileError` with `code` being the exit code and `message` being the compiler's error message.

---

## Directives

In addition to the directives mentioned [here](/packages/compiler-explorer-directives/#Directives), the following directives are supported:

### `///skip`
Avoid testing this code snippet.

### `///fails=<reason>`

When given, [`compile`](#compile) will fail if compiling and running the code (if enabled) succeeds, or if the error message doesn't include the given reason.

Cannot be defined together with [`output`](#`///output=<expected>`).

Usage example:

```cpp
///fails=expected ';' before '}' token
#include <iostream>

int main() {
  std::cout << "Hello CE!"
}
```

### `///output=<expected>`

When given, [`compile`](#compile) will fail if the snippet's output doesn't include the given output.

Cannot be defined together with [`fails`](#`///fails=<reason>`).

Usage example:

```cpp
///external
///output=Hello CE!
#include <iostream>

int main() {
  std::cout << "Hello CE!";
}
```
