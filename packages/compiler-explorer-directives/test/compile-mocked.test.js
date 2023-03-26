const { stderr } = require('test-console');
const debug = require('debug');

jest.mock('cross-fetch', () => {
  const originalModule = jest.requireActual('cross-fetch');

  return jest.fn(originalModule.default).mockImplementationOnce(() => Promise.resolve({
    status: 500,
    statusText: 'Internal Server Error'
  }));
});

const { compile } = require('../src/compiler-explorer-directives');
const fetch = require('cross-fetch');

describe('compile mocked', function () {
  it('retries on 500', async function () {
    const info = {
      source: `#include <iostream>

int main() {
std::cout << "Hello Test";
}`,
      language: 'cpp',
      compiler: 'g83',
      options: '-Wall -Werror',
      execute: true,
      baseUrl: 'https://godbolt.org'
    };
    const inspect = stderr.inspect();
    const orig = debug.disable();
    debug.enable('reveal-compiler-explorer:*');
    const result = await compile(info);
    debug.enable(orig);
    inspect.restore();
    expect(result).toBe('Hello Test');
    expect(fetch).toBeCalledTimes(2);
    expect(inspect.output.join('')).toEqual(expect.stringContaining('response status is 500 (Internal Server Error), retrying'));
  });
});
