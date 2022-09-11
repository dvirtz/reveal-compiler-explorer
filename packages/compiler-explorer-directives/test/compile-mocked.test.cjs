const sinon = require('sinon');
const { stderr } = require('test-console');
const assert = require('assert');
const rewire = require('rewire');
const rewired = rewire('compiler-explorer-directives');
const debug = require('debug');

describe('compile mocked', function () {
  it('retries on 500', async function () {
    const post = sinon.fake((() => {
      var firstTime = true;
      return function (baseURL, ...options) {
        if (firstTime) {
          firstTime = false;
          throw {
            statusCode: 500
          };
        }
        return {
          code: 0,
          stdout: [{
            text: 'success'
          }],
          stderr: []
        }
      };
    })());
    rewired.__set__('post', post);
    const compile = rewired.__get__('compile');
    const info = {
      source: `#include <iostream>

int main() {
std::cout << "Hello Test\\nGoodbye";
}`,
      language: 'cpp',
      compiler: 'g83',
      options: '-Wall -Werror',
      execute: false,
      baseUrl: 'https://godbolt.org'
    };
    const inspect = stderr.inspect();
    const orig = debug.disable();
    debug.enable('reveal-compiler-explorer:*');
    const result = await compile(info);
    debug.enable(orig);
    inspect.restore();
    assert(result === 'success');
    assert(post.calledTwice);
    assert.match(inspect.output.join(''), /compile error \{ statusCode: 500 \}.*retrying/s);
  });
});
