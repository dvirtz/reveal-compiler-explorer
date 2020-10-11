'use strict'

import { parseMarkdown } from 'reveal-test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('parseMarkdown', function () {
  it('should parse markdown code blocks', async function () {
    const path = join(__dirname, 'test.md');
    const codeInfos = await parseMarkdown(path, path);
    assert.strictEqual(codeInfos.length, 2);
    assert.deepStrictEqual(codeInfos[0], {
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
      baseUrl: 'https://godbolt.org/',
      failReason: /missing semicolon/,
      path: `${path}:19`
    });
    assert.deepStrictEqual(codeInfos[1], {
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
      execute: true,
      baseUrl: 'https://godbolt.org/',
      path: `${path}:49`
    });
  });
});