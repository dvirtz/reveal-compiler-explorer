'use strict'

import { compile, CompileError } from 'compiler-explorer-directives';
import assert from 'assert';

describe('compile', function () {
  this.timeout('10s');

  it('compiles valid code', async function () {
    const info = {
      source: `#include <iostream>

int main() {
  std::cout << "Hello Test\\nGoodbye";
}`,
      language: 'cpp',
      compiler: 'g83',
      options: '-Wall -Werror',
      execute: true,
      baseUrl: 'https://godbolt.org/'
    };
    const result = await compile(info);
    assert.strictEqual(result, 'Hello Test\nGoodbye');
  });

  it('fails on invalid non-executing code', async function () {
    const info = {
      source: `#include <iostream>

int main() {
  std::cout << "Hello Test\\n"
}`,
      language: 'cpp',
      compiler: 'g83',
      options: '-Wall -Werror',
      baseUrl: 'https://godbolt.org/',
      path: 'file.md:10'
    };
    await assert.rejects(compile(info), {
      name: 'CompileError',
      message: /file\.md:10:\n.*expected ';' before '}'/s
    });
  });

  it('fails on invalid executing code', async function () {
    const info = {
      source: `#include <iostream>
      
      int main() {
        std::cerr << "FAILED\\n";
  return 2;
}`,
      language: 'cpp',
      compiler: 'g83',
      options: '-Wall -Werror',
      execute: true,
      baseUrl: 'https://godbolt.org/'
    };
    await assert.rejects(compile(info), (err) => {
      assert(err instanceof CompileError);
      assert.notStrictEqual(err.code, 0);
      assert.match(err.message, /FAILED/);
      return true;
    });
  });

  it('matches failReason', async function() {
    const info = {
      source: `#include <iostream>

int main() {
  std::cout << "Hello Test\\n"
}`,
      language: 'cpp',
      compiler: 'g83',
      options: '-Wall -Werror',
      baseUrl: 'https://godbolt.org/',
      path: 'file.md:10',
      failReason: new RegExp(`expected ';' before '}'`)
    };
    await assert.rejects(compile(info), (err) => {
      assert(err instanceof CompileError);
      assert.notStrictEqual(err.code, 0);
      assert.match(err.message, info.failReason);
      return true;
    });
  });
});