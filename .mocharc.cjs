const process = require('process');

module.exports = {
  spec: (process.version >= 'v14.0.0') ? 'packages/**/test/**/*.test.js' : './packages/reveal-test/test/consume.test.cjs'
};