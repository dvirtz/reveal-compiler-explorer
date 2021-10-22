const { compile } = require('..');
const assert = require('assert');
const semver = require('semver');

describe('library consumer', function () {
  it('can require the library', async function () {
    await assert.rejects(compile, {
      name: 'TypeError',
      message: semver.lt(process.version, '16.0.0') ? `Cannot read property 'failReason' of undefined` : `Cannot read properties of undefined (reading 'failReason')`
    });
  });
});
