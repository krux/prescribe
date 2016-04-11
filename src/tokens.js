import {escapeQuotes} from './utils';

/**
 * Token is a base class for all token types parsed.
 */
export class Token {
  /**
   * Constructor.
   *
   * @param {string} type The type of the Token.
   * @param {Number} length The length of the Token text.
   */
  constructor(type, length) {
    this.type = type;
    this.length = length;
    this.text = '';
  }
}

/**
 * CommentToken represents comment tags.
 */
export class CommentToken extends Token {
  /**
   * Constructor.
   *
   * @param {string} content The content of the comment
   * @param {Number} length The length of the Token text.
   */
  constructor(content, length) {
    super('comment', length || (content ? content.length : 0));
    this.content = content;
  }

  toString() {
    return `<!--${this.content}`;
  }
}

/**
 * CharsToken represents non-tag characters.
 */
export class CharsToken extends Token {
  /**
   * Constructor.
   *
   * @param {Number} length The length of the Token text.
   */
  constructor(length) {
    super('chars', length);
  }

  toString() {
    return this.text;
  }
}

/**
 * TagToken is a base class for all tag-based Tokens.
 */
export class TagToken extends Token {
  /**
   * Constructor.
   *
   * @param {string} type The type of the token.
   * @param {string} tagName The tag name.
   * @param {Number} length The length of the Token text.
   * @param {Object} attrs The dictionary of attributes and values
   * @param {Object} booleanAttrs If an entry has 'true' then the attribute
   *                              is a boolean attribute
   */
  constructor(type, tagName, length, attrs, booleanAttrs) {
    super(type, length);
    this.tagName = tagName;
    this.attrs = attrs;
    this.booleanAttrs = booleanAttrs;
    this.unary = false;
    this.html5Unary = false;
  }

  /**
   * Formats the given token tag.
   *
   * @param {TagToken} tok The TagToken to format.
   * @param {?string} [content=null] The content of the token.
   * @returns {string} The formatted tag.
   */
  static formatTag(tok, content = null) {
    let str = `<${tok.tagName}`;
    for (let key in tok.attrs) {
      if (tok.attrs.hasOwnProperty(key)) {
        str += ` ${key}`;

        const val = tok.attrs[key];
        if (typeof tok.booleanAttrs == 'undefined' ||
            typeof tok.booleanAttrs[key] == 'undefined') {
          str += `="${escapeQuotes(val)}"`;
        }
      }
    }

    if (tok.rest) {
      str += tok.rest;
    }

    if (tok.unary && !tok.html5Unary) {
      str += '/>';
    } else {
      str += '>';
    }

    if (content) {
      str += `${content}</${tok.tagName}>`;
    }

    return str;
  }
}

/**
 * StartTagToken represents a start token.
 */
export class StartTagToken extends TagToken {
  /**
   * Constructor.
   *
   * @param {string} tagName The tag name.
   * @param {Number} length The length of the Token text
   * @param {Object} attrs The dictionary of attributes and values
   * @param {Object} booleanAttrs If an entry has 'true' then the attribute
   *                              is a boolean attribute
   * @param {boolean} unary True if the tag is a unary tag
   * @param {string} rest The rest of the content.
   */
  constructor(tagName, length, attrs, booleanAttrs, unary, rest) {
    super('startTag', tagName, length, attrs, booleanAttrs);
    this.unary = unary;
    this.rest = rest;
  }

  toString() {
    return TagToken.formatTag(this);
  }
}

/**
 * AtomicTagToken represents an atomic tag.
 */
export class AtomicTagToken extends TagToken {
  /**
   * Constructor.
   *
   * @param {string} tagName The name of the tag.
   * @param {Number} length The length of the tag text.
   * @param {Object} attrs The attributes.
   * @param {Object} booleanAttrs If an entry has 'true' then the attribute
   *                              is a boolean attribute
   * @param {string} content The content of the tag.
   */
  constructor(tagName, length, attrs, booleanAttrs, content) {
    super('atomicTag', tagName, length, attrs, booleanAttrs);
    this.content = content;
  }

  toString() {
    return TagToken.formatTag(this, this.content);
  }
}

/**
 * EndTagToken represents an end tag.
 */
export class EndTagToken extends Token {
  /**
   * Constructor.
   *
   * @param {string} tagName The name of the tag.
   * @param {Number} length The length of the tag text.
   */
  constructor(tagName, length) {
    super('endTag', length);
    this.tagName = tagName;
  }

  toString() {
    return `</${this.tagName}>`;
  }
}
