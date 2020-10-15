const { compile } = require('..');
const assert = require('assert');

describe('library consumer', function () {
  it('can require the library', async function () {
    await assert.rejects(compile, {
      name: 'TypeError',
      message: `Cannot read property 'failReason' of undefined`
    });
  });
});
