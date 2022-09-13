import dedent from 'dedent-js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const path = (() => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, 'test.md');
})();

export const expected = [{
  source: dedent`
  #include <iostream>
  
  int main() {
    std::cout << "Hello CE!";
  }

  `,
  displaySource: dedent`
  #include <iostream>
  
  int main() {
    std::cout << "Hello CE!";
  }

  `,
  language: 'c++',
  compiler: 'g102',
  options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
  libs: [],
  execute: true,
  baseUrl: 'https://godbolt.org',
  path: `${path}:19`,
  expectedOutput: 'Hello CE!'
}, {
  source: dedent`
  import cblas;

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
  }`,
  displaySource: dedent`
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
               2, 3]);`,
  language: 'd',
  compiler: 'ldc1_21',
  options: '-m32',
  libs: [{
    name: 'cblas',
    ver: 'trunk'
  }, {
    name: 'mir_core',
    ver: 'trunk'    
  }],
  execute: false,
  baseUrl: 'https://godbolt.org',
  path: `${path}:79`
}, {
  source: dedent`
  #include <iostream>

  int main() {
    std::cout << "Hello CE!"
  }

  `,
  displaySource: dedent`
  #include <iostream>

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
  baseUrl: 'https://godbolt.org',
  path: `${path}:114`
}, {
  source: dedent`
  void foo(short i);
  void foo(int i) = delete;

  void bar() {
  foo(static_cast<short>(42));    // ok
  foo(42);                        // error, deleted function
  }

  `,
  displaySource: dedent`
  void foo(short i);
  void foo(int i) = delete;

  foo(static_cast<short>(42));    // ok
  foo(42);                        // error, deleted function`,
  language: 'c++',
  compiler: 'g102',
  options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
  libs: [],
  baseUrl: 'https://godbolt.org',
  path: `${path}:127`,
  failReason: 'use of deleted function \'void foo(int)\''
}, {
  source: dedent`
  #include <iostream>

  int main() {
    std::cout << "Hello\\nCE\\n!";
  }

  `,
  displaySource: dedent`
  #include <iostream>

  int main() {
    std::cout << "Hello\\nCE\\n!";
  }

  `,
  language: 'c++',
  compiler: 'g102',
  options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
  libs: [],
  execute: true,
  baseUrl: 'https://godbolt.org',
  path: `${path}:155`,
  expectedOutput: 'Hello\nCE\n!'
}
];
