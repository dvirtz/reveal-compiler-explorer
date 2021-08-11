import { parseMarkdownFile, compile } from 'reveal-test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const codeInfo = await (async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const path = join(__dirname, '..', 'demo.md');
  const config = { runMain: false };
  return await parseMarkdownFile(path, config);
})();

describe("demo presentation", function () {
  this.timeout('10s');

  codeInfo.forEach((info, index) => {
    it(`should have snippet ${index} compiled`, async function () {
      await compile(info);
    });
  });
});