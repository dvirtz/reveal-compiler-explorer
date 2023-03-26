'use strict'
const { compile, parseMarkdownFile } = require('reveal-test');
const { expected, path } = require('./parse-markdown.expected.js');

const codeInfos = await (async () => {
  const config = { compiler: 'g102', runMain: true };
  return await parseMarkdownFile(path, config);
})();

describe('parseMarkdownFile', function () {
  it('should parse all blocks', function () {
    expect(codeInfos.length).toBe(5);
  });

  codeInfos.forEach((info, index) => {
    it(`should parse code block #${index}`, function () {
      expect(info).toStrictEqual(expected[index]);
    });

    it(`should compile code block #${index}`, async function () {
      await compile(info);
    }, 10000);
  });
});
