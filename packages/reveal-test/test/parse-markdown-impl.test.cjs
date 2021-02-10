const assert = require('assert');
const rewire = require('rewire');
const rewired = rewire('reveal-test');
const parseMarkdownImpl = rewired.__get__('parseMarkdownImpl');

describe('parseMarkdownImpl', function () {
  it('errors on output and failure defined together', async function () {
    const markdown = `
\`\`\`ada
///output=expected
///fails=failed
function Square(num : Integer) return Integer is
begin
    return num**2;
end Square;
`
    await assert.rejects(parseMarkdownImpl(markdown), /cannot have "fails" and "output" together/);
  });
});