const { compile } = require('../src/reveal-test');

if (!process.env.DEBUG_MODE) {
  jest.setTimeout(10000);
}

describe('compile', function() {
  it('succeeds on matching output', async function() {
    const info = {
      source: `#include <iostream>

int main() {
  std::cout << "Hello\\n" << "World\\n";
}
`,
      language: 'c++',
      compiler: 'g102',
      options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
      libs: [],
      execute: true,
      baseUrl: 'https://godbolt.org',
      path: `demo.md:19`,
      expectedOutput: 'Hello'
    };
    await compile(info);
  });

  it('fails on mismatching output', async function() {
    const info = {
      source: `#include <iostream>

int main() {
  std::cout << "Hello\\n" << "World\\n";
}
`,
      language: 'c++',
      compiler: 'g102',
      options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
      libs: [],
      execute: true,
      baseUrl: 'https://godbolt.org',
      path: `demo:19`,
      expectedOutput: 'Hello You'
    };
    await expect(compile(info)).rejects.toThrow(`demo:19:
output mismatch:
actual: Hello
World
expected: Hello You`
    );
  });

  it('succeeds on matching multiline output', async function() {
    const info = {
      source: `#include <iostream>

int main() {
  std::cout << "Hello\\n" << "World\\n";
}
`,
      language: 'c++',
      compiler: 'g102',
      options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
      libs: [],
      execute: true,
      baseUrl: 'https://godbolt.org',
      path: `demo.md:19`,
      expectedOutput: 'Hello\nWorld'
    };
    await compile(info);
  });
});
