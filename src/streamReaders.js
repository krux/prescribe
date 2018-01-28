import {CommentToken, CharsToken, StartTagToken,
    AtomicTagToken, EndTagToken} from './tokens';

/**
 * Regular Expressions for parsing tags and attributes
 *
 * @type {Object}
 */
const REGEXES = {
  startTag: /^<([\-A-Za-z0-9_!:]+)((?:\s+[\w\-]+(?:\s*=?\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
  endTag: /^<\/([\-A-Za-z0-9_:]+)[^>]*>/,
  attr: /(?:([\-A-Za-z0-9_]+)\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))|(?:([\-A-Za-z0-9_]+)(\s|$)+)/g,
  fillAttr: /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noresize|noshade|nowrap|readonly|selected)$/i
};

/**
 * Reads a comment token
 *
 * @param {string} stream The input stream
 * @returns {CommentToken}
 */
export function comment(stream) {
  const endNeedle = '-->';
  const index = stream.indexOf(endNeedle);
  const startIndex = String('<!--').length;
  const endIndex = index + endNeedle.length;
  if (index >= 0) {
    return new CommentToken(stream.substring(startIndex, endIndex), endIndex);
  }
}

/**
 * Reads non-tag characters.
 *
 * @param {string} stream The input stream
 * @returns {CharsToken}
 */
export function chars(stream) {
  const index = stream.indexOf('<');
  return new CharsToken(index >= 0 ? index : stream.length);
}

/**
 * Reads start tag token.
 *
 * @param {string} stream The input stream
 * @returns {StartTagToken}
 */
export function startTag(stream) {
  const endTagIndex = stream.indexOf('>');
  if (endTagIndex !== -1) {
    const match = stream.match(REGEXES.startTag);
    if (match) {
      const attrs = {};
      const booleanAttrs = {};
      let rest = match[2];

      match[2].replace(REGEXES.attr, function(match, name) {
        if (!(arguments[2] || arguments[3] || arguments[4] || arguments[5])) {
          attrs[name] = '';
        } else if (arguments[5]) {
          attrs[arguments[5]] = '';
          booleanAttrs[arguments[5]] = true;
        } else {
          attrs[name] = arguments[2] || arguments[3] || arguments[4] ||
            REGEXES.fillAttr.test(name) && name || '';
        }

        rest = rest.replace(match, '');
      });

      return new StartTagToken(match[1], match[0].length, attrs,
        booleanAttrs, !!match[3],
        rest.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''));
    }
  }
}

/**
 * Reads atomic tag token.
 *
 * @param {string} stream The input stream
 * @returns {AtomicTagToken}
 */
export function atomicTag(stream) {
  const start = startTag(stream);
  if (start) {
    const rest = stream.slice(start.length);
    // for optimization, we check first just for the end tag
    if (rest.match(new RegExp('<\/\\s*' + start.tagName + '\\s*>', 'i'))) {
      // capturing the content is inefficient, so we do it inside the if
      const match = rest.match(new RegExp('([\\s\\S]*?)<\/\\s*' + start.tagName + '\\s*>', 'i'));
      if (match) {
        return new AtomicTagToken(start.tagName,
          match[0].length + start.length,
          start.attrs, start.booleanAttrs, match[1]);
      }
    }
  }
}

/**
 * Reads an end tag token.
 *
 * @param {string} stream The input stream
 * @returns {EndTagToken}
 */
export function endTag(stream) {
  const match = stream.match(REGEXES.endTag);
  if (match) {
    return new EndTagToken(match[1], match[0].length);
  }
}
