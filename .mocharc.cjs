const process = require('process');

process.env.DEBUG_COLORS = false;

module.exports = {
  spec: (process.version >= 'v14.0.0') ? 'packages/**/test/**/*.test.{js,cjs}' : './packages/reveal-test/test/consume.test.cjs'
};
