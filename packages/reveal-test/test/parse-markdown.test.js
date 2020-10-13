'use strict'

import { parseMarkdownSync, compile } from 'reveal-test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = join(__dirname, 'test.md');
const expected = [{
  source: `#include <iostream>

int main() {
  std::cout << "Hello CE!";
}
`,
  displaySource: `#include <iostream>

int main() {
  std::cout << "Hello CE!";
}
`,
  language: 'c++',
  compiler: 'g102',
  options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
  libs: [],
  execute: true,
  baseUrl: 'https://godbolt.org/',
  path: `${path}:19`
}, {
  source: `import cblas;

void main()
{
double[] A = [1, 0, 0,
              0, 1, 1];
double[] B = [1, 0,
              0, 1,
              2, 2];
auto C = new double[2*2];

gemm(Order.RowMajor, Transpose.NoTrans, Transpose.NoTrans,
        2, 2, 3, /*no scaling*/1,
        A.ptr, 3, B.ptr, 2, /*no addition*/0, C.ptr, 2);

assert(C == [1, 0,
             2, 3]);
}
`,
  displaySource: `double[] A = [1, 0, 0,
              0, 1, 1];
double[] B = [1, 0,
              0, 1,
              2, 2];
auto C = new double[2*2];

gemm(Order.RowMajor, Transpose.NoTrans, Transpose.NoTrans,
        2, 2, 3, /*no scaling*/1,
        A.ptr, 3, B.ptr, 2, /*no addition*/0, C.ptr, 2);

assert(C == [1, 0,
             2, 3]);`,
  language: 'd',
  compiler: 'ldc1_20',
  options: '-m32',
  libs: [{
    name: 'cblas',
    ver: 'trunk'
  }],
  execute: false,
  baseUrl: 'https://godbolt.org/',
  path: `${path}:48`
}, {
  source: `#include <iostream>

int main() {
  std::cout << "Hello CE!"
}
`,
  displaySource: `#include <iostream>

int main() {
  std::cout << "Hello CE!"
}
`,
  language: 'c++',
  compiler: 'g102',
  options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
  libs: [],
  execute: true,
  failReason: `expected ';' before '}' token`,
  baseUrl: 'https://godbolt.org/',
  path: `${path}:112`
}, {
  source: `void foo(short i);
void foo(int i) = delete;

void bar() {
foo(static_cast<short>(42));    // ok
foo(42);                        // error, deleted function
}
`,
  displaySource: `void foo(short i);
void foo(int i) = delete;

foo(static_cast<short>(42));    // ok
foo(42);                        // error, deleted function`,
  language: 'c++',
  compiler: 'g102',
  options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
  libs: [],
  baseUrl: 'https://godbolt.org/',
  path: `${path}:125`,
  failReason: 'use of deleted function \'void foo(int)\''
}, {
  source: `template< class ForwardIt, class T >
void iota( ForwardIt first, ForwardIt last, T value );
`,
  displaySource: `template< class ForwardIt, class T >
void iota( ForwardIt first, ForwardIt last, T value );
`,
  language: '',
  compiler: undefined,
  options: '',
  libs: [],
  baseUrl: 'https://godbolt.org/',
  path: `${path}:143`,
  failReason: 'Not Found'
}
];

describe('parseMarkdown', function () {
  const codeInfos = parseMarkdownSync(path);
  it('should parse all blocks', function () {
    assert.strictEqual(codeInfos.length, 5);
  });

  codeInfos.forEach((info, index) => {
    it(`should parse code block #${index}`, function () {
      assert.deepStrictEqual(info, expected[index]);
    });

    it(`should compile code block #${index}`, async function() {
      this.timeout(10000);
      await assert.doesNotReject(compile(info));
    });
  });
});