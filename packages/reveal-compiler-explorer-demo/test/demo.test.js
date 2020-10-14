import { parseMarkdownSync, compile, CompileError } from 'reveal-test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("demo presentation", function () {
  this.timeout('10s');

  const path = join(__dirname, '..', 'demo.md');
  const config = { runMain: false };
  const codeInfo = parseMarkdownSync(path, config);
  codeInfo.forEach((info, index) => {
    it(`should have snippet ${index} compiled`, async function () {
      await assert.doesNotReject(compile(info));
    });
  });
});