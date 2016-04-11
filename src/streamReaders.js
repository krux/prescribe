// Regular Expressions for parsing tags and attributes
const regexes = {
  startTag: /^<([\-A-Za-z0-9_]+)((?:\s+[\w\-]+(?:\s*=?\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
  endTag: /^<\/([\-A-Za-z0-9_]+)[^>]*>/,
  attr: /(?:([\-A-Za-z0-9_]+)\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))|(?:([\-A-Za-z0-9_]+)(\s|$)+)/g,
  fillAttr: /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noresize|noshade|nowrap|readonly|selected)$/i
};

export function comment(stream) {
  const index = stream.indexOf('-->');
  if (index >= 0) {
    return {
      content: stream.substr(4, index - 1),
      length: index + 3
    };
  }
}

export function endTag(stream) {
  const match = stream.match(regexes.endTag);
  if (match) {
    return {
      tagName: match[1],
      length: match[0].length
    };
  }
}

export function atomicTag(stream) {
  const start = startTag(stream);
  if (start) {
    const rest = stream.slice(start.length);
    // for optimization, we check first just for the end tag
    if (rest.match(new RegExp('<\/\\s*' + start.tagName + '\\s*>', 'i'))) {
      // capturing the content is inefficient, so we do it inside the if
      const match = rest.match(new RegExp('([\\s\\S]*?)<\/\\s*' + start.tagName + '\\s*>', 'i'));
      if (match) {
        // good to go
        return {
          tagName: start.tagName,
          attrs: start.attrs,
          content: match[1],
          length: match[0].length + start.length
        };
      }
    }
  }
}

export function startTag(stream) {
  const endTagIndex = stream.indexOf('>');
  if (endTagIndex !== -1) {
    const match = stream.match(regexes.startTag);
    if (match) {
      const attrs = {};
      const booleanAttrs = {};
      let rest = match[2];

      match[2].replace(regexes.attr, function(match, name) {
        if (!(arguments[2] || arguments[3] || arguments[4] || arguments[5])) {
          attrs[name] = '';
        } else if (arguments[5]) {
          attrs[arguments[5]] = '';
          booleanAttrs[arguments[5]] = true;
        } else {
          attrs[name] = arguments[2] || arguments[3] || arguments[4] ||
              regexes.fillAttr.test(name) && name || '';
        }

        rest = rest.replace(match, '');
      });

      return {
        tagName: match[1],
        attrs,
        booleanAttrs,
        rest: rest.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''),
        unary: !!match[3],
        length: match[0].length
      };
    }
  }
}

export function chars(stream) {
  const index = stream.indexOf('<');
  return {
    length: index >= 0 ? index : stream.length
  };
}
