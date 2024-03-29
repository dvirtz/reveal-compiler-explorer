'use strict'

const { displayUrl } = require('compiler-explorer-directives');

describe('displayUrl', function () {
  it('generates display url from info', function () {
    const info = {
      source: `#include <iostream>

int main() {
  std::cout << "Hello Test\\n";
}
`,
      language: 'cpp',
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
    };
    const urlRe = /^https:\/\/godbolt.org\/#(.*)/;
    const url = displayUrl(info);
    expect(url).toMatch(urlRe);
    url.match(urlRe).slice(1).forEach(fragment => {
      expect(JSON.parse(decodeURIComponent(fragment))).toStrictEqual({
        version: 4,
        content: [{
          type: 'row', content: [
            {
              type: 'component',
              componentName: 'codeEditor',
              componentState: {
                id: 1,
                lang: 'cpp',
                source: `#include <iostream>

int main() {
  std::cout << "Hello Test\\n";
}
`,
                options: { compileOnChange: true, colouriseAsm: true },
                fontScale: 2.5
              }
            },
            {
              type: 'column',
              content: [{
                type: 'component',
                componentName: 'compiler',
                componentState: {
                  source: 1,
                  lang: 'cpp',
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
                  fontScale: 3.0,
                  filters: {
                    commentOnly: true,
                    directives: true,
                    intel: true,
                    labels: true,
                    trim: true,
                    execute: true
                  }
                }
              }, {
                type: 'component',
                componentName: 'output',
                componentState: {
                  compiler: 1
                }
              }
              ]
            }
          ]
        }],
        settings: {
          theme: 'dark'
        }
      });
    });
  });
});
