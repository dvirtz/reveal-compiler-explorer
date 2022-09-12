'use strict'

import { parseCode } from 'compiler-explorer-directives';

// https://stackoverflow.com/a/17822752/621176
function commonPrefix(words) {
  const max_word = words.reduce(function (a, b) { return a > b ? a : b });
  let prefix = words.reduce(function (a, b) { return a > b ? b : a }); // min word

  while (max_word.indexOf(prefix) != 0) {
    prefix = prefix.slice(0, -1);
  }

  return prefix;
}

String.prototype.stripMargin = function () {
  const lines = this.split('\n').filter(l => l.length > 0);
  const margin = commonPrefix(lines);
  return lines.map(l => l.slice(margin.length)).join('\n');
};

describe('parseCode', function () {
  it('parses code directives', async function () {
    const code = `///hide
///compiler=g83
///options=-Wall
///options+=-Werror
///libs=lib1:version1,lib2:version2
///execute
///external
#include <iostream>

///unhide
int main() {
  std::cout << "Hello Test\\n"
}`;
    const info = await parseCode(code, 'cpp');
    expect(info).toStrictEqual({
      source: `#include <iostream>

int main() {
  std::cout << "Hello Test\\n"
}`,
      displaySource: `int main() {
  std::cout << "Hello Test\\n"
}`,
      language: 'c++',
      compiler: 'g83',
      options: '-Wall -Werror',
      libs: [{
        name: 'lib1',
        ver: 'version1'
      },
      {
        name: 'lib2',
        ver: 'version2'
      }
      ],
      execute: true,
      baseUrl: 'https://godbolt.org'
    });
  });

  it("respects config", async function () {
    const code = `///hide
///options+=-Werror
///execute
#include <iostream>

///unhide
int main() {
  std::cout << "Hello Test\\n";
}`;
    const info = await parseCode(code, 'cpp', {
      compiler: 'clang800', options: '-O0', executeMain: false, useLocal: true, localPort: 1234, libs: [{
        name: 'fmt',
        version: '410'
      }]
    });
    expect(info).toStrictEqual({
      source: `#include <iostream>

int main() {
  std::cout << "Hello Test\\n";
}`,
      displaySource: `int main() {
  std::cout << "Hello Test\\n";
}`,
      language: 'c++',
      compiler: 'clang800',
      options: '-O0 -Werror',
      execute: true,
      libs: [{
        name: 'fmt',
        version: '410'
      }],
      baseUrl: 'http://localhost:1234'
    });
  });
});
