jest.mock('cross-fetch', () => {
  const originalModule = jest.requireActual('cross-fetch');

  return jest.fn(originalModule.default);
});

const { compile } = require('../src/reveal-test');
const fetch = require('cross-fetch');
const dedent = require('dedent-js');

describe('compile mocked', function () {

  it('compiles code with url includes', async function() {
    const info = {
      source: dedent`
      #include <https://raw.githubusercontent.com/hanickadot/compile-time-regular-expressions/master/single-header/ctre.hpp>
      #include <string_view>
      
      constexpr auto match(std::string_view sv) noexcept {
        return ctre::match<"h.*">(sv);
      }
      `,
      language: 'c++',
      compiler: 'g102',
      options: '-std=c++2a -O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
      libs: [],
      execute: false,
      baseUrl: 'https://godbolt.org'
    };
    await compile(info);
    // make sure 2nd invocation uses cached code
    await compile(info);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
