/**
 * Empty Elements - HTML 4.01
 *
 * @type {RegExp}
 */
const EMPTY = /^(AREA|BASE|BASEFONT|BR|COL|FRAME|HR|IMG|INPUT|ISINDEX|LINK|META|PARAM|EMBED)$/i;

/**
 * Elements that you can intentionally leave open (and which close themselves)
 *
 * @type {RegExp}
 */
const CLOSESELF = /^(COLGROUP|DD|DT|LI|OPTIONS|P|TD|TFOOT|TH|THEAD|TR|BR)$/i;

/**
 * Corrects a token.
 *
 * @param {Token} tok The token to correct
 * @returns {Token} The corrected token
 */
function correct(tok) {
  if (tok && tok.type === 'startTag') {
    tok.unary = EMPTY.test(tok.tagName) || tok.unary;
    tok.html5Unary = !(/\/>$/).test(tok.text);
  }
  return tok;
}

/**
 * Peeks at the next token in the parser.
 *
 * @param {HtmlParser} parser The parser
 * @param {Function} readTokenImpl The underlying readToken implementation
 * @returns {Token} The next token
 */
function peekToken(parser, readTokenImpl) {
  const tmp = parser.stream;
  const tok = correct(readTokenImpl());
  parser.stream = tmp;
  return tok;
}

/**
 * Closes the last token.
 *
 * @param {HtmlParser} parser The parser
 * @param {Array<Token>} stack The stack
 */
function closeLast(parser, stack) {
  const tok = stack.pop();

  // prepend close tag to stream.
  parser.prepend(`</${tok.tagName}>`);
}

/**
 * Create a new token stack.
 *
 * @returns {Array<Token>}
 */
function newStack() {
  const stack = [];

  stack.last = function() {
    return this[this.length - 1];
  };

  stack.lastTagNameEq = function(tagName) {
    const last = this.last();
    return last && last.tagName &&
      last.tagName.toUpperCase() === tagName.toUpperCase();
  };

  stack.containsTagName = function(tagName) {
    for (let i = 0, tok; (tok = this[i]); i++) {
      if (tok.tagName === tagName) {
        return true;
      }
    }
    return false;
  };

  return stack;
}

/**
 * Return a readToken implementation that fixes input.
 *
 * @param {HtmlParser} parser The parser
 * @param {Object} options Options for fixing
 * @param {boolean} options.tagSoupFix True to fix tag soup scenarios
 * @param {boolean} options.selfCloseFix True to fix self-closing tags
 * @param {Function} readTokenImpl The underlying readToken implementation
 * @returns {Function}
 */
export default function fixedReadTokenFactory(parser, options, readTokenImpl) {
  const stack = newStack();

  const handlers = {
    startTag(tok) {
      const tagName = tok.tagName;

      if (tagName.toUpperCase() === 'TR' && stack.lastTagNameEq('TABLE')) {
        parser.prepend('<TBODY>');
        prepareNextToken();
      } else if (options.selfCloseFix && CLOSESELF.test(tagName) &&
          stack.containsTagName(tagName)) {
        if (stack.lastTagNameEq(tagName)) {
          closeLast(parser, stack);
        } else {
          parser.prepend(`</${tok.tagName}>`);
          prepareNextToken();
        }
      } else if (!tok.unary) {
        stack.push(tok);
      }
    },

    endTag(tok) {
      const last = stack.last();
      if (last) {
        if (options.tagSoupFix && !stack.lastTagNameEq(tok.tagName)) {
          // cleanup tag soup
          closeLast(parser, stack);
        } else {
          stack.pop();
        }
      } else if (options.tagSoupFix) {
        // cleanup tag soup part 2: skip this token
        readTokenImpl();
        prepareNextToken();
      }
    }
  };

  function prepareNextToken() {
    const tok = peekToken(parser, readTokenImpl);
    if (tok && handlers[tok.type]) {
      handlers[tok.type](tok);
    }
  }

  return function fixedReadToken() {
    prepareNextToken();
    return correct(readTokenImpl());
  };
}
