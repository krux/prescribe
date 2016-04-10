import HtmlParser from '../../src/HtmlParser';

/**
 * Test parsing
 * 
 * @param {HtmlParser|string} s A parser to continue or a string tos tart with
 * @param {Object} options Options to pass to the parser
 * @returns {Array<Object, String, HtmlParser>}
 */
export default function testParse(s, options = {}) {
  const parser = typeof s === "string" ? new HtmlParser(s, options) : s;
  const tok = parser.readToken();
  return [tok, HtmlParser.tokenToString(tok), parser];
}

