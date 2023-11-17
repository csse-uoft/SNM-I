/**
 * Return if Any of the items in `b` is in `a`.
 * @param {[]} a
 * @param {[]} b
 *
 */
function ArrayIncludesAny(a = [], b = []) {
  console.log(ArrayIncludesAny, a, b)
  return b.some(r => a.includes(r));
}


/**
 * Return if All items in `b` is in `a`.
 * @param {[]} a
 * @param {[]} b
 *
 */
function ArrayIncludesAll(a = [], b = []) {
  for (const item of b) {
    if (!a.includes(item)) return false;
  }
  return true;
}

/**
 * Return if the two arrays are same regardless of the order.
 * @param {[]} a
 * @param {[]} b
 */
function ArrayEquals(a = [], b = []) {
  return a.length === b.length && a.sort().join() === b.sort().join();
}

/**
 * @param {string} str
 * @param {string} regex
 */
function StringMatch(str = '', regex) {
  return !!str.match(new RegExp(regex));
}


module.exports = {
  builtInFunctions: {ArrayIncludesAny, ArrayIncludesAll, ArrayEquals, StringMatch}
}