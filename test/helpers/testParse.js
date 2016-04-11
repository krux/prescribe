import HtmlParser from '../../src/HtmlParser';

/**
 * Test parsing
 *
 * @param {HtmlParser|string} s A parser to continue or a string tos tart with
 * @param {Object} options Options to pass to the parser
 * @returns {Array<Object, String, HtmlParser>}
 */
export function testParse(s, options = {}) {
  const parser = typeof s === "string" ? new HtmlParser(s, options) : s;
  const tok = parser.readToken();
  return [tok, HtmlParser.tokenToString(tok), parser];
}

/**
 * Returns a test function that has the token and string passed in from
 * parsing.
 *
 * @param {string} pattern The pattern to parse
 * @param {Object|Function} options The options for the parser
 * @param {?Function} theTest The test function
 * @returns {Function}
 */
export function parses(pattern, options, theTest) {
  if (typeof options == 'function') {
    theTest = options;
    options = {};
  }

  return () => {
    const [tok, str] = testParse(pattern, options);
    return theTest(tok, str);
  };
}
