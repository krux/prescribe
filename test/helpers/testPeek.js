import HtmlParser from '../../src/HtmlParser';

export function peeks(s, options = {}, theTest) {
  if (typeof options == 'function') {
    theTest = options;
    options = {};
  }

  const parser = typeof s === 'string' ? new HtmlParser(s, options) : s;
  const tok = parser.peekToken();

  return () => theTest(tok, parser);
}
