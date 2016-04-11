// Empty Elements - HTML 4.01
const EMPTY = /^(AREA|BASE|BASEFONT|BR|COL|FRAME|HR|IMG|INPUT|ISINDEX|LINK|META|PARAM|EMBED)$/i;

// Elements that you can| intentionally| leave open
// (and which close themselves)
const CLOSESELF = /^(COLGROUP|DD|DT|LI|OPTIONS|P|TD|TFOOT|TH|THEAD|TR)$/i;

export default function fixedReadTokenFactory(parser, options, readTokenImpl) {
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

  function correct(tok) {
    if (tok && tok.type === 'startTag') {
      tok.unary = EMPTY.test(tok.tagName) || tok.unary;
      tok.html5Unary = !(/\/>$/).test(tok.text);
    }
    return tok;
  }

  function peekToken() {
    const tmp = parser.stream;
    const tok = correct(readTokenImpl());
    parser.stream = tmp;
    return tok;
  }

  function closeLast() {
    const tok = stack.pop();

    // prepend close tag to stream.
    parser.prepend(`</${tok.tagName}>`);
  }

  const handlers = {
    startTag(tok) {
      const tagName = tok.tagName;

      if (tagName.toUpperCase() === 'TR' && stack.lastTagNameEq('TABLE')) {
        parser.prepend('<TBODY>');
        prepareNextToken();
      } else if (options.selfCloseFix && CLOSESELF.test(tagName) &&
          stack.containsTagName(tagName)) {
        if (stack.lastTagNameEq(tagName)) {
          closeLast();
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
          closeLast();
        } else {
          stack.pop();
        }
      } else if (options.tagSoupFix) {
        // cleanup tag soup part 2: skip this token
        skipToken();
      }
    }
  };

  function skipToken() {
    readTokenImpl();
    prepareNextToken();
  }

  function prepareNextToken() {
    const tok = peekToken();
    if (tok && handlers[tok.type]) {
      handlers[tok.type](tok);
    }
  }

  return function fixedReadToken() {
    prepareNextToken();
    return correct(readTokenImpl());
  };
}
