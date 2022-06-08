const {GraphDBDocument} = require('./graphDBDocument');
const {GraphDB, getGraphDBAttribute} = require('./graphDB');
const {getIdFromIdentifier, pathsToObj, graphDBValueToJsValue, SPARQL} = require('./helpers');

const generateQuery = (doc, populate, cnt = 0) => {
  const whereClause = [], paths = [];

  for (const currKey of Object.keys(populate)) {
    // Skip if the field does not exist, there is no way to populate
    if (doc[currKey] === undefined)
      continue;

    // If the field is not yet populated
    if (!(doc[currKey] instanceof GraphDBDocument || (Array.isArray(doc[currKey]) && doc[currKey][0] instanceof GraphDBDocument))) {
      const {whereClause: innerWhere} = doc.getPopulateQuery(currKey, cnt++);
      whereClause.push(...innerWhere);
      paths.push(currKey);
    }
    // If the field is populated and there are nested fields waiting for populate
    else if (Object.keys(populate[currKey]).length > 0) {
      if (Array.isArray(doc[currKey])) {
        for (const [idx, currDoc] of doc[currKey].entries()) {
          const {whereClause: innerWhere, paths: innerPaths} = generateQuery(currDoc, populate[currKey], cnt);
          whereClause.push(...innerWhere);
          paths.push(...innerPaths.map(item => `${currKey}.${idx}.${item}`));
        }
      } else {
        const {whereClause: innerWhere, paths: innerPaths} = generateQuery(doc[currKey], populate[currKey], cnt);
        whereClause.push(...innerWhere);
        paths.push(...innerPaths.map(item => `${currKey}.${item}`));
      }

    }
  }
  return {whereClause, paths};
}

/**
 * Performance optimized for multiple populates.
 * @class GraphDBDocumentArray
 * @extends {Array}
 */
class GraphDBDocumentArray extends Array {

  /**
   * populate a single property for every document.
   * @param {string} path - e.g. 'primary_contact'
   * @return {Promise<GraphDBDocumentArray>}
   */
  async populate(path) {
    return this.populateMultiple([path]);
  }

  /**
   * Populate multiple properties for every document.
   * Breadth first populate for combining queries.
   * @param {string[]} paths - e.g. ['primary_contact', 'organization']
   * @return {Promise<GraphDBDocumentArray>}
   */
  async populateMultiple(paths) {
    paths = [...paths];
    paths.sort();
    const populate = pathsToObj(paths);


    const generate = () => {
      let whereClause = [], paths = [], cnt = 0;
      for (const [idx, doc] of this.entries()) {
        const {whereClause: innerWhereClause, paths: innerPaths} = generateQuery(doc, populate, cnt);
        cnt += innerWhereClause.length;
        whereClause.push(...innerWhereClause);
        paths.push(...innerPaths);
      }
      paths = [...new Set(paths)];
      whereClause = [...new Set(whereClause)];
      return {whereClause, paths}
    }

    let whereClause = [];
    while (({whereClause, paths} = generate()).whereClause.length > 0) {
      const query = `${SPARQL.getSPARQLPrefixes()}\nCONSTRUCT {?s ?p ?o} WHERE {\n\t?s ?p ?o\nFILTER (\n\t${whereClause.join(' ||\n\t')}\n\t)\n}`;
      const data = {};

      await GraphDB.sendConstructQuery(query, ({subject, predicate, object}) => {
        subject = getGraphDBAttribute(subject.value);
        predicate = SPARQL.getPrefixedURI(predicate.value);
        object = object.termType === 'NamedNode' ? getGraphDBAttribute(object.value) : object.value;

        const key = subject.slice(0, subject.lastIndexOf('_'));
        if (!this[0].model.instancePrefix2Model.has(key)) return;

        const option = this[0].model.instancePrefix2Model.get(key).internalKey2Option.get(predicate);

        // Ignore unknown predicates
        if (!option) return;

        object = graphDBValueToJsValue(object, Array.isArray(option.type) ? option.type[0] : option.type);

        predicate = option.externalKey;

        if (!data[subject])
          data[subject] = {};
        const innerData = data[subject];

        if (Array.isArray(option.type)) {
          if (!innerData[predicate]) innerData[predicate] = [];
          innerData[predicate].push(object);
        } else {
          innerData[predicate] = object;
        }
      });

      for (const path of paths) {
        for (const doc of this.values()) {
          // This can be a string or an array, instance identifier(s)
          const instanceNames = doc.get(path);

          // Skip undefined/empty predicate
          if (instanceNames == null) continue;

          let newValue;
          if (Array.isArray(instanceNames)) {
            newValue = new GraphDBDocumentArray();
            for (const instanceName of instanceNames) {
              if (typeof instanceName !== "string")
                throw new Error("GraphDBDocument.populateMultiple: Error 1");

              const _id = getIdFromIdentifier(instanceName);
              const key = instanceName.slice(0, instanceName.lastIndexOf('_'));
              const model = doc.model.instancePrefix2Model.get(key);

              newValue.push(new GraphDBDocument({
                data: {_id, ...data[instanceName]},
                model: model,
              }));
            }
          } else {
            const instanceName = instanceNames;
            if (typeof instanceNames !== "string")
              throw new Error("GraphDBDocument.populateMultiple: Error 1");

            const _id = getIdFromIdentifier(instanceName);
            const key = instanceName.slice(0, instanceName.lastIndexOf('_'));
            const model = doc.model.instancePrefix2Model.get(key);

            newValue = new GraphDBDocument({
              data: {_id, ...data[instanceName]},
              model: model,
            });
          }

          doc.set(path, newValue, true);
        }

      }
    }
    return this;
  }

  /**
   * Override default JSON.stringify behavior.
   * To Plain JS Object, not a string.
   * @return {object}
   */
  toJSON() {
    const data = [];
    for (const val of this) {
      if (val.toJSON) {
        data.push(val.toJSON());
      } else {
        data.push(val);
      }
    }
    return data;
  }
}

module.exports = {GraphDBDocumentArray}
