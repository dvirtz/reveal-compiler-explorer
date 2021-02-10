'use strict'

import { compile, CompileError } from 'compiler-explorer-directives';
import assert from 'assert';

describe('compile', function () {
  this.timeout('60s');

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
      baseUrl: 'https://godbolt.org'
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
      baseUrl: 'https://godbolt.org',
    };
    await assert.rejects(compile(info), {
      name: 'CompileError',
      message: /expected ';' before '}'/
    });
  });

  it('fails on linker error', async function () {
    const info = {
      source: `#include <iostream>

      void foo();
      
      int main() {
        foo();
}`,
      language: 'cpp',
      compiler: 'g83',
      options: '-Wall -Werror',
      execute: true,
      baseUrl: 'https://godbolt.org'
    };
    await assert.rejects(compile(info), (err) => {
      assert(err instanceof CompileError);
      assert.notStrictEqual(err.code, 0);
      assert.match(err.message, /undefined reference to `foo\(\)'/);
      return true;
    });
  });

  it('returns stderr + stdout', async function () {
    const info = {
      source: `#include <iostream>
      
      int main() {
        std::cout << "Hello";
        std::cerr << "World";
  return 2;
}`,
      language: 'cpp',
      compiler: 'g83',
      options: '-Wall -Werror',
      execute: true,
      baseUrl: 'https://godbolt.org'
    };
    const result = await compile(info);
    assert.strictEqual(result, 'World\nHello');
  });

  it('sets expected failure', async function () {
    const info = {
      source: `#include <iostream>

int main() {
  std::cout << "Hello Test\\n"
}`,
      language: 'cpp',
      compiler: 'g83',
      options: '-Wall -Werror',
      baseUrl: 'https://godbolt.org'
    };
    await assert.rejects(compile(info), (err) => {
      assert(err instanceof CompileError);
      assert.notStrictEqual(err.code, 0);
      assert.match(err.message, /expected ';' before '}'/);
      return true;
    });
  });

  it('fails with msvc', async function () {
    const info = {
      source: `int foo() {}`,
      language: 'cpp',
      compiler: 'vcpp_v19_24_x64',
      options: '/O2',
      baseUrl: 'https://godbolt.org'
    };
    await assert.rejects(compile(info), (err) => {
      assert(err instanceof CompileError);
      assert.notStrictEqual(err.code, 0);
      assert.match(err.message, /'foo': must return a value/);
      return true;
    });
  });
});