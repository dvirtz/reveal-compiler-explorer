'use strict'
import assert from 'assert';
import dedent from 'dedent-js';
import { parseMarkdown } from 'reveal-test';

describe('parseMarkdown', function () {
  it('errors on output and failure defined together', async function () {
    const markdown = dedent`
    \`\`\`ada
    ///output=expected
    ///fails=failed
    function Square(num : Integer) return Integer is
    begin
        return num**2;
    end Square;
    `;
    await assert.rejects(parseMarkdown(markdown), /cannot have "fails" and "output" together/);
  });

  it('parses inline html code', async function () {
    const markdown = dedent`
    <pre>
        <code class="lang-cpp">
          ///hide
          #include &ltiostream&gt;
          
          ///unhide
          int main() {
            std::cout &lt&lt &quot;Hello CE!&quot;;
          }
        </code>
    </pre>
    `;
    const codeInfos = await parseMarkdown(markdown, {compiler: 'g102'});
    assert.strictEqual(codeInfos.length, 1);
    assert.deepStrictEqual(codeInfos[0], {
      source: dedent`
      #include <iostream>
      
      int main() {
        std::cout << "Hello CE!";
      }
      `,
      displaySource: dedent`
      int main() {
        std::cout << "Hello CE!";
      }
      `,
      language: 'c++',
      compiler: 'g102',
      options: '-O2 -march=haswell -Wall -Wextra -pedantic -Wno-unused-variable -Wno-unused-parameter',
      libs: [],
      execute: true,
      baseUrl: 'https://godbolt.org',
      line: 2
    });
  });
});
