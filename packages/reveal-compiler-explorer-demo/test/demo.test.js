import { parseMarkdownFile, compile } from 'reveal-test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';

const codeInfo = await (async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const path = join(__dirname, '..', 'demo.md');
  const config = { runMain: false };
  return await parseMarkdownFile(path, config);
})();

jest.setTimeout(10000);

describe("demo presentation", function () {
  codeInfo.forEach((info, index) => {
    it(`should have snippet ${index} compiled`, async function () {
      await compile(info);
    });
  });
});
