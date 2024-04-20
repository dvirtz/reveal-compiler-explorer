'use strict'
const dedent = require('dedent-js');
const { parseMarkdown } = require('reveal-test');

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
    \`\`\`
    `;
    await expect(parseMarkdown(markdown)).rejects.toThrow(/cannot have "fails" and "output" together/);
  });

  it('parses inline html code', async function () {
    const markdown = dedent`
    <pre>
        <code class="cls lang-cpp">
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
    expect(codeInfos).toHaveLength(1);
    expect(codeInfos[0]).toStrictEqual({
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

  it('ignores mark elements', async function () {
    const markdown = dedent`
    \`\`\`ada
    function Square(num : Integer) return Integer is
    begin
        return <mark>num**2</mark>;
    end Square;
    \`\`\`

    <pre>
        <code class="cls lang-cpp">
          ///hide
          #include &ltiostream&gt;
          
          ///unhide
          int <mark>main</mark>() {
            std::cout &lt&lt &quot;Hello CE!&quot;;
          }
        </code>
    </pre>
    `;
    const codeInfos = await parseMarkdown(markdown, {'c++': { compiler: 'g102'}, 'ada': { compiler: 'gnat111'} });
    expect(codeInfos).toHaveLength(2);
    expect(codeInfos[0]).toStrictEqual({
      source: dedent`
      function Square(num : Integer) return Integer is
      begin
          return <mark>num**2</mark>;
      end Square;

      `,
      displaySource: dedent`
      function Square(num : Integer) return Integer is
      begin
          return <mark>num**2</mark>;
      end Square;

      `,
      language: 'ada',
      compiler: 'gnat111',
      options: '',
      libs: [],
      baseUrl: 'https://godbolt.org',
      line: 1
    });
    expect(codeInfos[1]).toStrictEqual({
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
      line: 9
    });
  });

  it('ignores empty code blocks', async function () {
    expect.assertions(1);
    const markdown = dedent`
    \`\`\`cpp
    \`\`\`

    <pre><code class="language-typescript"></code></pre>
    `;
    await expect(parseMarkdown(markdown)).resolves.toHaveLength(0);
  });

  it(`ignores skipped code blocks`, async function () {
    const markdown = dedent`
    \`\`\`cpp
    ///skip
    #include <iostream>
    
    int main() {
      std::cout << "Hello CE!";
    }
    \`\`\`
    `;
    await expect(parseMarkdown(markdown)).resolves.toHaveLength(0);
  });
});
