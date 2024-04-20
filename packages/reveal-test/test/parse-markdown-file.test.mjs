'use strict'
import { compile, parseMarkdownFile } from 'reveal-test';
import { expected, path } from './parse-markdown.expected.js';
import { temporaryWrite } from 'tempy';
import dedent from 'dedent-js';

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

  it(`allows preprocessing markdown`, async function () {
    const markdown = dedent`
    \`\`\`cpp
    #include <iostream>
    
    int main() {
      std::cout << "Hello CE!";
    }
    \`\`\`
    `;
    const markdownFile = await temporaryWrite(markdown, { extension: 'md' });
    const codeInfos = await parseMarkdownFile(markdownFile, {}, (content) => content.replace(/CE/g, 'World'));
    expect(codeInfos).toHaveLength(1);
    expect(codeInfos[0].source).toContain('Hello World!');
  });
});
