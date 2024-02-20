/**
 * @param text: the string to sanitize
 * @returns {string}
 */
const sanitize = text => {
  return text.replace(/[^\w\., ()/-]/, '').trim();
}

module.exports = { sanitize }