'use strict'
import assert from 'assert';
import { compile, parseMarkdownFile } from 'reveal-test';
import { expected, path } from './parse-markdown.expected.js';

const codeInfos = await (async () => {
  const config = { compiler: 'g102', runMain: true };
  return await parseMarkdownFile(path, config);
})();

describe('parseMarkdownFile', function () {
  it('should parse all blocks', function () {
    assert.strictEqual(codeInfos.length, 5);
  });

  codeInfos.forEach((info, index) => {
    it(`should parse code block #${index}`, function () {
      assert.deepStrictEqual(info, expected[index]);
    });

    it(`should compile code block #${index}`, async function () {
      this.timeout(10000);
      await assert.doesNotReject(compile(info));
    });
  });
});
