const { compile } = require('..');
const semver = require('semver');

describe('library consumer', function () {
  it('can require the library', async function () {
    await expect(compile).rejects.toThrow(semver.lt(process.version, '16.0.0') ? `Cannot read property 'failReason' of undefined` : `Cannot read properties of undefined (reading 'failReason')`);
  });
});
