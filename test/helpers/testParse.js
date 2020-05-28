import HtmlParser from '../../src/HtmlParser';

/**
 * Test parsing
 *
 * @param {HtmlParser|string} s A parser to continue or a string to start with
 * @param {Object} options Options to pass to the parser
 * @returns {Array<Object, String, HtmlParser>}
 */
export function testParse(s, options = {}) {
  const parser = typeof s === 'string' ? new HtmlParser(s, options) : s;
  const tok = parser.readToken();
  return [tok, tok.toString(), parser];
}

/**
 * Returns a test function that has the token and string passed in from
 * parsing.
 *
 * @param {string} s The pattern to parse
 * @param {Object|Function} options The options for the parser
 * @param {?Function} theTest The test function
 * @returns {Function}
 */
export function parses(s, options, theTest) {
  if (typeof options == 'function') {
    theTest = options;
    options = {};
  }

  return () => {
    const [tok, str] = testParse(s, options);
    return theTest(tok, str);
  };
}

export function parsesCompletely(s, options, theTest) {
  if (typeof options == 'function') {
    theTest = options;
    options = {};
  }

  return () => {
    const parser = typeof s === 'string' ? new HtmlParser(s, options) : s;
    let tok = parser.readToken();
    let str = '';
    while (tok) {
      str += tok.toString();
      tok = parser.readToken();
    }
    return theTest(str);
  };
}

export function fixes(s, theTest) {
  return () => {
    const parser = typeof s === 'string' ? new HtmlParser(s, {autoFix: true, allowInvalidHTML: true}) : s;
    let tok = parser.readToken();
    let str = '';
    while (tok) {
      str += tok.toString();
      tok = parser.readToken();
    }
    return theTest(str);
  };
}
