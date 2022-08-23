const {namespaces} = require('../../loaders/namespaces');

// Stateless helpers

const SPARQL = {

  getPredicate: (internalKey) => {
    // Process predicate
    if (internalKey.includes('://')) {
      // Full IRI
      throw new Error('Full IRI is not allowed. Please use the prefixed IRI.');
    } else if (internalKey.includes(':')) {
      // prefixed predicate
      return internalKey;
    } else {
      // The prefix is not provided, we use the default prefix ":"
      return `:${internalKey}`;
    }
  },

  /**
   * Get full URI of the prefixed URI.
   * @param prefixedURI {string}
   */
  getFullURI: (prefixedURI) => {
    const indexOfColon = prefixedURI.indexOf(':');
    const prefix = prefixedURI.substring(0, indexOfColon);
    for (const [definedPrefix, namespace] of Object.entries(namespaces)) {
      if (prefix === definedPrefix) {
        return `${namespace}${prefixedURI.substring(indexOfColon + 1)}`;
      }
    }
    throw new Error(`Cannot get full URI, prefix ${prefix} is not defined.`);
  },

  /**
   * Get prefixed URI.
   * i.e. cp:Client
   * @param fullURI {string}
   * @return {null|string} prefixed URI or null
   */
  getPrefixedURI: (fullURI) => {
    for (const [definedPrefix, namespace] of Object.entries(namespaces)) {
      if (fullURI.startsWith(namespace)) {
        return `${definedPrefix}:${fullURI.substring(namespace.length)}`;
      }
    }
    console.log(`${fullURI} does not match any prefixes.`)
    return null;
  },
  /**
   *
   * @param [prefixes] {string[]}
   */
  getSPARQLPrefixes: (prefixes) => {
    let sparqlPrefixes = [];
    if (!prefixes) {
      for (const [definedPrefix, namespace] of Object.entries(namespaces)) {
        sparqlPrefixes.push(`PREFIX ${definedPrefix}: <${namespace}>`);
      }

    } else {
      for (const prefix of prefixes) {
        if (!namespaces[prefix]) throw new Error(`Prefix ${prefix} is not defined.`);

        sparqlPrefixes.push(`PREFIX ${prefix}: <${namespaces[prefix]}>`);
      }
    }

    return sparqlPrefixes.join('\n');
  }
}

const DeleteType = {
  CASCADE: 0,
  NON_CASCADE: 1,
};

const Helpers = {
  Types: {
    NamedIndividual: 'owl:NamedIndividual',
    String,
    Number,
    Date,
    Boolean,
    // Refers to the model itself
    Self: 'GraphDB.Self!' // `GraphDB.Self` is some special value that is not used anywhere.
  },

  DeleteType,
  defaultOptions: {
    // When store data to graphDB, we add a prefix `has_` to each predicate
    prefix: 'has_',

    // For array datatype, `s` is appended to the external key
    suffix: 's', // for Array

    // You can customize to internal key in GraphDB
    // Example: has_account
    internalKey: null,

    // You can also customize to external key in server
    // External key is used in searching and query result
    // Example: accounts
    externalKey: null,

    // Operation to do on delete.
    onDelete: DeleteType.NON_CASCADE,
  },

  stringToSpaces: string => string.replace(/[\w:_]/g, ' '),

  Comparison: {$ne: "", $ge: ">=", $le: "<=", $gt: ">", $lt: "<"},

  valToGraphDBValue: (val, type) => {
    if (val == null) throw new Error('valToGraphDBValue: Val cannot be undefined');

    // Number
    if (type === Helpers.Types.Number) {

      // Does not accept NaN, isNaN(null) = false
      if (isNaN(val) || val === null)
        throw new Error(`Cannot convert ${val} to type Number`)
      return `${Number(val)}`;
    }
    // Date
    else if (type === Helpers.Types.Date) {
      // ISO date string
      if (typeof val === "string") {
        const parsedTimestamp = Date.parse(val);
        if (parsedTimestamp && new Date(parsedTimestamp).toISOString() === val) {
          val = parsedTimestamp;
        } else {
          val = Number(val);
        }
      }
      // Timestamp
      if (typeof val === "number")
        val = new Date(val).toISOString();
      else if (val instanceof Date)
        val = val.toISOString();
      return `"${val}"^^xsd:datetimes`;
    }
    // String
    else if (type === Helpers.Types.String) {
      return JSON.stringify(String(val));
    }
    // Boolean
    else if (type === Helpers.Types.Boolean) {
      if (typeof val !== "boolean" && val !== 'true' && val !== 'false')
        throw new Error(`Expecting boolean or "true", "false" but got ${val}`);
      return `${val}`;
    }
    // NamedIndividual or GraphDBDocument instance
    else if (type === Helpers.Types.NamedIndividual || (typeof val === "string" && typeof type === "function")) {
      // Provides a GraphDBDocument instance
      if (val.individualName != null)
        return `${val.individualName}`

      // Make sure it has a proper syntax
      if (val.includes('://'))
        return `<${val}>`
      else if (val.includes(':'))
        return val;
      else
        throw new Error('Improper instance syntax:' + val);
    } else {
      throw new Error('Helpers.valToGraphDBValue: Should not reach here.');
    }
  },

  graphDBValueToJsValue: (val, type) => {
    if (type === Date) {
      return Date.parse(val);
    } else if (type === Number) {
      return Number(val);
    } else if (type === Boolean) {
      // val is a string
      return val === "true";
    }
    return val;
  },

  /**
   * Performs a deep merge of `source` into `target`.
   * @param target
   * @param source
   * @return {*}
   */
  deepAssign: (target, source) => {
    const isObject = (obj) => obj && typeof obj === 'object';

    if (!isObject(target) || !isObject(source)) {
      return source;
    }

    Object.keys(source).forEach(key => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = Helpers.deepAssign(Object.assign({}, targetValue), sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });

    return target;
  },

  isModel: (object) => typeof object === "function" && object.name === 'Model',
  getIdFromIdentifier: (identifier) => identifier.slice(identifier.lastIndexOf('_') + 1),
  /**
   * Convert populate object to paths.
   * @param {object|string[]} obj
   * @return {array}
   * @example `{a: ['b', 'c']} => ['a', 'a.b', 'a.c']`
   */
  objToPath: (obj) => {
    if (Array.isArray(obj)) return obj;

    const path = [];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object") {
        const innerPaths = Helpers.objToPath(value);

        if (innerPaths.length === 0) {
          path.push(`${key}`);
        } else {
          for (const innerPath of innerPaths) {
            path.push(`${key}.${innerPath}`);
          }
        }

      } else {
        path.push(key);
      }
    }
    return path;
  },

  /**
   * Reverse of objToPath but not identical
   * @param paths
   * @return {{}}
   * @example ['a', 'a.b', 'a.c'] => {a: {b: {}, c: {}}}
   */
  pathsToObj: (paths) => {
    if (!Array.isArray(paths))
      return paths;

    const obj = {};
    for (let path of paths) {
      path = path.trim();
      path = path.split('.');
      let curr = obj;
      for (const currKey of path) {
        if (!curr[currKey]) curr[currKey] = {};
        curr = curr[currKey];
      }
    }
    return obj;
  },

  regexBuilder: (pattern, flags) => {
    if (!flags) {
      return `"${pattern}"`;
    } else {
      return `"${pattern}", "${flags}"`
    }
  },

  /**
   * (javascript) returns the given object with keys sorted alphanumerically.
   * @param {T} obj the object to sort
   * @returns {T} the sorted object
   */
  sortObjectByKey: (obj) => Object.keys(obj).sort()
    .reduce((acc, c) => {
      acc[c] = obj[c];
      return acc
    }, {}),

  SPARQL,
}
module.exports = Helpers;
