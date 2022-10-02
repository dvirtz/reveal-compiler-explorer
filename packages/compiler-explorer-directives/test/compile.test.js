'use strict'

import { compile, CompileError } from 'compiler-explorer-directives';
import { jest } from '@jest/globals';

jest.setTimeout(60000);

describe('compile', function () {
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
    expect(result).toBe('Hello Test\nGoodbye');
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
    await expect(compile(info)).rejects.toThrow(/expected ';' before '}'/);
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
    let thrownError;
    try {
      await compile(info);
    } 
    catch(error) {
      thrownError = error;
    }
    expect(thrownError).toBeInstanceOf(CompileError);
    expect(thrownError.code).not.toBe(0);
    expect(thrownError.message).toMatch(/undefined reference to `foo\(\)'/);
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
    expect(result).toBe('World\nHello');
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
    let thrownError;
    try {
      await compile(info);
    } 
    catch(error) {
      thrownError = error;
    }
    expect(thrownError).toBeInstanceOf(CompileError);
    expect(thrownError.code).not.toBe(0);
    expect(thrownError.message).toMatch(/expected ';' before '}'/);
  });

  it('fails with msvc', async function () {
    const info = {
      source: `int foo() {}`,
      language: 'cpp',
      compiler: 'vcpp_v19_24_x64',
      options: '/O2',
      baseUrl: 'https://www.godbolt.ms'
    };
    let thrownError;
    try {
      await compile(info);
    } 
    catch(error) {
      thrownError = error;
    }
    expect(thrownError).toBeInstanceOf(CompileError);
    expect(thrownError.code).not.toBe(0);
    expect(thrownError.message).toMatch(/'foo': must return a value/);
  });
});
