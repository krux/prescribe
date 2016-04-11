
/**
 * Escape quotes in the given value.
 *
 * @param {string} value The value to escape.
 * @param {string} [defaultValue=''] The default value to return if value is falsy.
 * @returns {string}
 */
export function escapeQuotes(value, defaultValue = '') {
  return value ? value.replace(/(^|[^\\])"/g, '$1\\\"') : defaultValue;
}
