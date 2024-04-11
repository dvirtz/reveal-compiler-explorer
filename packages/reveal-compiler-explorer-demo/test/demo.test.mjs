import { parseMarkdownFile, compile } from 'reveal-test';
import path from 'path';
import dirname from './dirname.js';
import { jest } from '@jest/globals';

const codeInfo = await parseMarkdownFile(
  path.join(dirname, "..", "demo.md"), 
  { runMain: false }
);

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
