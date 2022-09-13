const { stderr } = require('test-console');
const debug = require('debug');
import { jest } from '@jest/globals';
import bent from 'bent';
import { compile } from 'compiler-explorer-directives';

jest.mock('bent');

describe('compile mocked', function () {
  it('retries on 500', async function () {
    const post = jest.fn((() => {
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
    bent.mockResolvedValue(post);
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
    expect(result).toBe('success');
    expect(post).toBeCalledTimes(2);
    expect(inspect.output.join('')).toMatch(/compile error \{ statusCode: 500 \}.*retrying/s);
  });
});
