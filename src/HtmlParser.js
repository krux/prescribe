import * as supports from './supports';
import * as streamReaders from './streamReaders';
import fixedReadTokenFactory from './fixedReadTokenFactory';

// Order of detection matters: detection of one can only
// succeed if detection of previous didn't
const detect = {
  comment: /^<!--/,
  endTag: /^<\//,
  atomicTag: /^<\s*(script|style|noscript|iframe|textarea)[\s\/>]/i,
  startTag: /^</,
  chars: /^[^<]/
};

export default class HtmlParser {
  constructor(stream = '', options = {}) {
    this.stream = stream;

    for (let key in supports) {
      if (supports.hasOwnProperty(key)) {
        if (options.autoFix) {
          options[`${key}Fix`] = true; // !supports[key];
        }
        options.fix = options.fix || options[`${key}Fix`];
      }
    }

    if (options.fix) {
      this._fixedReadToken = fixedReadTokenFactory(this, options, () => this._readTokenImpl());
    }
  }

  append(str) {
    this.stream += str;
  }

  prepend(str) {
    this.stream = str + this.stream;
  }

  _readTokenImpl() {
    // Enumerate detects in order
    for (let type in detect) {
      if (detect.hasOwnProperty(type)) {
        if (detect[type].test(this.stream)) {
          const token = streamReaders[type](this.stream);
          if (token) {
            token.type = token.type || type;
            token.text = this.stream.substr(0, token.length);
            this.stream = this.stream.slice(token.length);
            return token;
          }
          return null;
        }
      }
    }
  }

  readToken() {
    if (this._fixedReadToken) {
      return this._fixedReadToken();
    } else {
      return this._readTokenImpl();
    }
  }

  readTokens(handlers) {
    let tok;
    while ((tok = this.readToken())) {
      // continue until we get an explicit "false" return
      if (handlers[tok.type] && handlers[tok.type](tok) === false) {
        return;
      }
    }
  }

  clear() {
    const rest = this.stream;
    this.stream = '';
    return rest;
  }

  rest() {
    return this.stream;
  }
}

HtmlParser.supports = supports;

const tokenToStringHandlers = {
  comment(tok) {
    return `<!--${tok.content}`;
  },

  endTag(tok) {
    return `</${tok.tagName}>`;
  },

  atomicTag(tok) {
    return tokenToStringHandlers.startTag(tok) + tok.content + tokenToStringHandlers.endTag(tok);
  },

  startTag(tok) {
    let str = `<${tok.tagName}`;
    for (let key in tok.attrs) {
      if (tok.attrs.hasOwnProperty(key)) {
        str += ` ${key}`;

        const val = tok.attrs[key];
        if (typeof tok.booleanAttrs == 'undefined' || typeof tok.booleanAttrs[key] == 'undefined') {
          str += `="${escapeQuotes(val)}"`;
        }
      }
    }

    if (tok.rest) {
      str += tok.rest;
    }
    return str + (tok.unary && !tok.html5Unary ? '/>' : '>');
  },

  chars(tok) {
    return tok.text;
  }
};

HtmlParser.tokenToString = tok => {
  return tokenToStringHandlers[tok.type](tok);
};

HtmlParser.escapeAttributes = attrs => {
  const escapedAttrs = {};

  for (let name in attrs) {
    if (attrs.hasOwnProperty(name)) {
      escapedAttrs[name] = escapeQuotes(attrs[name], null);
    }
  }

  return escapedAttrs;
};

for (let key in supports) {
  if (supports.hasOwnProperty(key)) {
    HtmlParser.browserHasFlaw = HtmlParser.browserHasFlaw || (!supports[key]) && key;
  }
}

function escapeQuotes(value, defaultValue = '') {
  return value ? value.replace(/(^|[^\\])"/g, '$1\\\"') : defaultValue;
}
