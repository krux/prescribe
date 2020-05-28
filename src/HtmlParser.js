import * as supports from './supports';
import * as streamReaders from './streamReaders';
import fixedReadTokenFactory from './fixedReadTokenFactory';
import {escapeQuotes} from './utils';

/**
 * Detection regular expressions.
 *
 * Order of detection matters: detection of one can only
 * succeed if detection of previous didn't

 * @type {Object}
 */
const ignoredInvalidTags = /^<\s*(?:script|style)/i;

const detect = {
  comment: /^<!--/,
  endTag: /^<\//,
  atomicTag: /^<\s*(script|style|noscript|iframe|textarea)[\s\/>]/i,
  startTag: /^</,
  chars: /^[^<]/
};

/**
 * HtmlParser provides the capability to parse HTML and return tokens
 * representing the tags and content.
 */
export default class HtmlParser {
  /**
   * Constructor.
   *
   * @param {string} stream The initial parse stream contents.
   * @param {Object} options The options
   * @param {boolean} options.autoFix Set to true to automatically fix errors
   * @param {boolean} options.allowInvalidHTML Continue parsing invalid HTML, dropping minimal characters
   */
  constructor(stream = '', options = {}) {
    this.stream = stream;

    let fix = false;
    const fixedTokenOptions = {};
    this.allowInvalidHTML = options.allowInvalidHTML;

    for (let key in supports) {
      if (supports.hasOwnProperty(key)) {
        if (options.autoFix) {
          fixedTokenOptions[`${key}Fix`] = true; // !supports[key];
        }
        fix = fix || fixedTokenOptions[`${key}Fix`];
      }
    }

    if (fix) {
      this._readToken = fixedReadTokenFactory(this, fixedTokenOptions, () => this._readTokenImpl());
      this._peekToken = fixedReadTokenFactory(this, fixedTokenOptions, () => this._peekTokenImpl(this.allowInvalidHTML));
    } else {
      this._readToken = this._readTokenImpl;
      this._peekToken = () => this._peekTokenImpl(this.allowInvalidHTML);
    }
  }

  /**
   * Appends the given string to the parse stream.
   *
   * @param {string} str The string to append
   */
  append(str) {
    this.stream += str;
  }

  /**
   * Prepends the given string to the parse stream.
   *
   * @param {string} str The string to prepend
   */
  prepend(str) {
    this.stream = str + this.stream;
  }

  /**
   * The implementation of the token reading.
   *
   * @private
   * @returns {?Token}
   */
  _readTokenImpl() {
    const token = this._peekTokenImpl(this.allowInvalidHTML);
    if (token) {
      this.stream = this.stream.slice(token.length);
      return token;
    }
  }

  _consumeInvalidHtml() {
    this.stream = this.stream.slice(1);

    let token = this._peekTokenImpl(false);
    while (this.stream.length > 0 && token == null) {
      this.stream = this.stream.slice(1);
      token = this._peekTokenImpl(false);
    }

    return token;
  }

  /**
   * The implementation of token peeking.
   *
   * @returns {?Token}
   */
  _peekTokenImpl(allowInvalidHTML) {
    for (let type in detect) {
      if (detect.hasOwnProperty(type)) {
        if (detect[type].test(this.stream)) {
          const token = streamReaders[type](this.stream);

          if (token) {
            if (token.type === 'startTag' &&
                (/script|style/i).test(token.tagName)) {
              return null;
            } else {
              token.text = this.stream.substr(0, token.length);
              return token;
            }
          } else if (allowInvalidHTML && this.stream.length && token == null && !(ignoredInvalidTags.test(this.stream))) {
            return this._consumeInvalidHtml();
          }
        }
      }
    }
  }

  /**
   * The public token peeking interface.  Delegates to the basic token peeking
   * or a version that performs fixups depending on the `autoFix` setting in
   * options.
   *
   * @returns {object}
   */
  peekToken() {
    return this._peekToken();
  }

  /**
   * The public token reading interface.  Delegates to the basic token reading
   * or a version that performs fixups depending on the `autoFix` setting in
   * options.
   *
   * @returns {object}
   */
  readToken() {
    return this._readToken();
  }

  /**
   * Read tokens and hand to the given handlers.
   *
   * @param {Object} handlers The handlers to use for the different tokens.
   */
  readTokens(handlers) {
    let tok;
    while ((tok = this.readToken())) {
      // continue until we get an explicit "false" return
      if (handlers[tok.type] && handlers[tok.type](tok) === false) {
        return;
      }
    }
  }

  /**
   * Clears the parse stream.
   *
   * @returns {string} The contents of the parse stream before clearing.
   */
  clear() {
    const rest = this.stream;
    this.stream = '';
    return rest;
  }

  /**
   * Returns the rest of the parse stream.
   *
   * @returns {string} The contents of the parse stream.
   */
  rest() {
    return this.stream;
  }
}

HtmlParser.tokenToString = tok => tok.toString();

HtmlParser.escapeAttributes = attrs => {
  const escapedAttrs = {};

  for (let name in attrs) {
    if (attrs.hasOwnProperty(name)) {
      escapedAttrs[name] = escapeQuotes(attrs[name], null);
    }
  }

  return escapedAttrs;
};

HtmlParser.supports = supports;

for (let key in supports) {
  if (supports.hasOwnProperty(key)) {
    HtmlParser.browserHasFlaw = HtmlParser.browserHasFlaw || (!supports[key]) && key;
  }
}
