const { parseMarkdownFile, compile } = require('reveal-test');
const { join } = require('path');

const codeInfo = await (async () => {
  const path = join(__dirname, '..', 'demo.md');
  const config = { runMain: false };
  return await parseMarkdownFile(path, config);
})();

if (!process.env.DEBUG_MODE) {
  jest.setTimeout(10000);
}

describe("demo presentation", function () {
  codeInfo.forEach((info, index) => {
    it(`should have snippet ${index} compiled`, async function () {
      await compile(info);
    });
  });
});
