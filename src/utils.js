
/**
 * Escape quotes in the given value.
 *
 * @param {string} value The value to escape.
 * @param {string} [defaultValue=''] The default value to return if value is falsy.
 * @returns {string}
 */
export function escapeQuotes(value, defaultValue = '') {
  // There's no lookback in JS, so /(^|[^\\])"/ only matches the first of two `"`s.
  // Instead, just match anything before a double-quote and escape if it's not already escaped.
  return !value ? defaultValue : value.replace(/([^"]*)"/g, (_, prefix) => {
    return (/\\/).test(prefix) ? `${prefix}"` : `${prefix}\\\"`;
  });
}
