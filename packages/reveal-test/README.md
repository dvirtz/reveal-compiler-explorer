# `reveal-test`

[![npm version](https://badge.fury.io/js/reveal-test.svg)](https://badge.fury.io/js/reveal-test) 
![master](https://github.com/dvirtz/reveal-compiler-explorer/workflows/master/badge.svg)

Utilities for testing presentation code snippets by compiling them on [Compiler Explorer](https://godbolt.org).

Check out also [reveal-compiler-explorer](/packages/reveal-compiler-explorer) package.

## Example

```js
import { parseMarkdownSync, compile, CompileError } from 'reveal-test';
import assert from 'assert';

describe("demo presentation", function () {
  this.timeout('10s');

  const codeInfo = parseMarkdownSync('presentation.md');
  codeInfo.forEach((info, index) => {
    it(`should have snippet ${index} compiled`, async function () {
      if (info.failReason) {
        await assert.rejects(compile(info), (err) => {
          assert(err instanceof CompileError);
          assert.notStrictEqual(err.code, 0);
          assert.match(err.message, info.failReason);
          return true;
        });
      } else {
        await assert.doesNotReject(compile(info));
      }
    });
  });
});
```


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

### parseMarkdown

```js
parseMarkdown(path: String, config: Config = {}) => Promise<Array<SnippetInfo>>
```

Asynchronously generates a list of all code snippets from a given markdown file. For possible `config` fields, see [here](#configuration).

### parseMarkdownSync

```js
parseMarkdownSync(path: String, config: Config = {}) => Array<SnippetInfo>
```

Synchronously generates a list of all code snippets from a given markdown file. For possible `config` fields, see [here](/packages/compiler-explorer-directives/#Configuration).

### compile

```js
compile(info: SnippetInfo) => String
```

Calls CE's Rest API to compile a code snippet.

Returns output from compiling and running the code (if enabled) on success, otherwise throws `CompileError` with `code` being the exit code and `message` being the compiler's error message.

---

## Directives

In addition to the directives mentioned [here](/packages/compiler-explorer-directives/#Directives), the following directives are supported:

### `///failReason=<reason>`

When given, [`compile`](#compile) is expected to fail with an error containing the given reason.
