export const titleCase = text => {
  text = text.replace(/(^\w|_\w)/g, m => {
    return m.toUpperCase().replace('_', ' ')
  });
  return text.replace('In', 'in').replace('Of', 'of');
};

/**
 * @param data {[{condition_clauses: [{field_name, clauses: [{left_operand, right_operand, operator}]}]}]}
 **/
export const transformToFrontendType = data => {
  const val = [];

  // return empty array when create a new service
  if (!data) return val;

  for (const {condition_clauses} of data) {
    const condition = [];
    val.push(condition);
    for (const {field_name, clauses} of condition_clauses) {
      for (const {left_operand, right_operand, operator} of clauses) {
        condition.push([left_operand, operator, right_operand]);
      }
    }
  }
  return val;
};

/**
 * @param data {[[]]}
 */
export const transformToBackendType = data => {
  const val = [];
  for (const condition of data) {
    const conditionClauses = [];
    val.push({condition_clauses: conditionClauses});

    for (const [left_operand, operator, right_operand] of condition) {
      // search for existing field_name
      const idx = conditionClauses.findIndex(conditionClause => conditionClause.field_name === left_operand);
      if (idx !== -1) {
        conditionClauses[idx].clauses.push({left_operand, right_operand, operator});
      } else {
        conditionClauses.push({
          field_name: left_operand,
          clauses: [{left_operand, right_operand, operator}]
        })
      }
    }
  }
  return val;
};

/**
 *
 * @param string {string}
 * @returns {*}
 */
export function escapeString(string) {
  return '"' + string.replace(/[\\"]/g, '\\$&') + '"'; // $& means the whole matched string
}

/**
 *
 * @param string {string}
 * @returns {*}
 */
export function unescapeString(string) {
  return string.slice(1, -1).replace(/\\([\\"])/g, '$1');
}

export function escapeList(list) {
  return JSON.stringify(list);
}

export function unescapeList(string) {
  try {
    const array = JSON.parse(string);
    return Array.isArray(array) ? array : [];
  } catch (e) {
    return [];
  }
}
