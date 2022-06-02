const {getGraphDBAttribute, GraphDB} = require("./graphDB");
const {GraphDBDocumentArray} = require("./graphDBDocumentArray");
const {GraphDBDocument} = require('./graphDBDocument');
const {
  Types, Comparison, stringToSpaces, valToGraphDBValue, graphDBValueToJsValue, objToPath, isModel, DeleteType, SPARQL
} = require('./helpers');

/**
 * Create a document based on the model.
 * Note: The constructor does not comply OOP since it is dynamically generated.
 * Same as `GraphDBModel.createDocument`
 *
 * @name GraphDBModel
 * @param {object} data - The data / properties in the new document
 * @return {GraphDBDocument}
 * @constructor
 *
 */
class GraphDBModel {

  // Let the IDE happy
  /**
   * @type {Map}
   */
  externalKey2Option;
  /**
   * @type {Map}
   */
  internalKey2Option;
  /**
   * @type {Map}
   */
  instancePrefix2Model;
  /**
   * @type {GDSchemaOptions}
   */
  schemaOptions;
  /**
   * @type {{}}
   */
  schema;

  /**
   * Internally create a GraphDBModel class
   * @private
   * @param {{}} props
   * @return {GraphDBModel}
   */
  static init(props) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

    // The constructor of GraphDBModel
    function Model(data) {
      return Model.createDocument(data);
    }

    // Inherit the GraphDBModel and assign values
    Model.__proto__ = Object.create(GraphDBModel.prototype);
    Object.assign(Model, props);
    return Model;
  }


  /**
   * Create a document based on the model.
   * Identical to `Model(data)`
   * @param {object} data - The data / properties in the new document
   * @return {GraphDBDocument}
   */
  createDocument(data) {
    return new GraphDBDocument({data, isNew: true, model: this});
  };

  /**
   * Remove fields that are not in the schema.
   * @private
   * @param {object} data
   */
  cleanData(data) {
    for (const [key, val] of Object.entries(data)) {
      if (!this.externalKey2Option.has(key) || val == null) {
        delete data[key]
      }
    }
    return data;
  }

  /**
   * Get all path from the current model
   * @private
   * @return {string[]}
   */
  getCascadePaths() {
    const paths = [];
    for (const [key, option] of this.externalKey2Option.entries()) {
      const type = Array.isArray(option.type) ? option.type[0] : option.type;
      if (isModel(type) && option.onDelete === DeleteType.CASCADE) {
        paths.push(key);
        for (const innerPath of type.getCascadePaths()) {
          paths.push(`${key}.${innerPath}`);
        }
      }
    }
    return paths;
  }

  /**
   * Generate creation query.
   * @param {number|string} id
   * @param data
   * @return {Promise<{footer: string, instanceName: string, innerQueryBodies: string[], header: string, queryBody: string}>}
   */
  async generateCreationQuery(id, data) {
    // Remove unwanted fields
    this.cleanData(data);

    const instanceName = `:${this.schemaOptions.name}_${id}`;

    const header = `${SPARQL.getSPARQLPrefixes()}\nINSERT DATA {\n`;
    const footer = '}\n';
    let queryBody = `\t${instanceName} `;
    const instanceNameSpaces = stringToSpaces(instanceName) + ' ';

    // Add rdf:type from schemaOptions.rdfTypes
    queryBody += `rdf:type ${this.schemaOptions.rdfTypes.join(', ')};\n\t${instanceNameSpaces}`;

    const innerQueryBodies = [];
    const length = Object.keys(data).length;
    for (const [index, [key, val]] of Object.entries(data).entries()) {
      if (this.externalKey2Option.has(key)) {
        const options = this.externalKey2Option.get(key);

        // Pre-process Types.Self. Replace Types.Self to this model.
        if (options.type === Types.Self) {
          options.type = this;
        }
        if (Array.isArray(options.type) && options.type[0] === Types.Self) {
          options.type[0] = this;
        }

        // TODO: Data validations
        // skip keys without value
        if (val == null || (Array.isArray(val) && val.length === 0) || val === '') {
          // skip the last property
          if (index === length - 1)
            queryBody = queryBody.slice(0, -(3 + instanceNameSpaces.length)) + '.\n';
          continue;
        }
        // Process predicate
        queryBody += SPARQL.getPredicate(options.internalKey) + ' ';

        if (Object.values(Types).includes(options.type)) {
          queryBody += valToGraphDBValue(val, options.type);
        }
        // nested model
        else if (typeof options.type === "function") {
          // already created instance, given an instance name
          if (typeof val === "string") {
            queryBody += `:${val}`;
          } else if (val instanceof GraphDBDocument && !val.isNew) {
            queryBody += `:${val.individualName}`;
          } else {
            // Get data from a document, Wrap it with a new model
            const obj = val.toJSON ? val.toJSON() : val;

            const innerInstance = await options.type(obj).getQueries();
            queryBody += `${innerInstance.instanceName}`;
            innerQueryBodies.push(innerInstance.queryBody)
          }
        } else if (Array.isArray(options.type)) {
          const innerType = options.type[0];

          for (const item of val) {
            if (Object.values(Types).includes(innerType)) {
              queryBody += valToGraphDBValue(item, innerType);
            }
            // nested model
            else if (typeof innerType === "function") {
              // already created instance, given an instance name
              if (typeof item === "string") {
                queryBody += `:${item}`;
              } else {
                // Get data from a document, Wrap it with a new model
                const obj = item.toJSON ? item.toJSON() : item;

                const innerInstance = await innerType(obj).getQueries();
                queryBody += `${innerInstance.instanceName}`;
                innerQueryBodies.push(innerInstance.queryBody)
              }
            }
            queryBody += ' , ';
          }
          queryBody = queryBody.slice(0, -3);
        } else {
          throw new Error(`Unknown type in ${key}: ${val}, requires ${options.type}`)
        }
        if (index === length - 1)
          queryBody += '.\n'
        else
          queryBody += `;\n\t${instanceNameSpaces}`;
      }
    }
    return {queryBody, innerQueryBodies, header, footer, instanceName}
  };

  /**
   * @private
   * @param filter
   * @param config
   * @return {{query: string, where: array, construct: array}}
   */
  generateFindQuery(filter, config = {}) {
    const {counters = {p: 0, o: 0}, subjectNameOverride} = config;
    const subject = subjectNameOverride || `?s`;
    const constructClause = [], whereClause = [];

    constructClause.push(`${subject} ?p${counters.p} ?o${counters.o}`);
    // Choose all
    whereClause.push(`${subject} ?p${counters.p} ?o${counters.o}.`);

    // Add rdf:type from schemaOptions.rdfTypes
    whereClause.push(`${subject} rdf:type ${this.schemaOptions.rdfTypes.join(', ')}.`)

    // If filter._id is provided, constraints document ids
    if (filter._id) {
      let ids;
      if (typeof filter._id === "object" && Array.isArray(filter._id.$in)) {
        ids = filter._id.$in;
      } else if (typeof filter._id === "string" || typeof filter._id === "number") {
        ids = [filter._id];
      } else {
        throw new Error('Model.find: filter._id supports only {$in: array}, number or string.')
      }
      const filterStr = ids.map(id =>
        `${subject} = :${this.schemaOptions.name}_${id}`
      ).join(' || ');
      whereClause.push(`FILTER(${filterStr})`);
    }

    for (const [index, [key, val]] of Object.entries(filter).entries()) {
      // skip undefined/null value
      if (val == null) continue;

      if (this.externalKey2Option.has(key)) {
        const options = this.externalKey2Option.get(key);
        const object = `?o${counters.o}_${index}`;

        whereClause.push(`${subject} ${SPARQL.getPredicate(options.internalKey)} ${object}.`);

        if (typeof val === "object") {
          const operators = Object.keys(val).filter(item => item.charAt(0) === '$');
          if (operators.length > 1) {
            for (const operator of operators) {
              const operand = val[operator]
              if (operator === "$gt" || operator === "$lt" || operator === "$ge" || operator === "$le")
                whereClause.push(`FILTER(${object} ${Comparison[operator]} ${operand})`)
              else
                throw new Error('Model.find: Query with multiple operators');
            }
            continue;
          }

          // Deal with operators
          if (operators.length === 1) {
            const operator = Object.keys(val)[0];
            const operand = val[operator];

            // $in with array
            if (operator === '$in' && Array.isArray(operand)) {
              const filter = operand.map(item =>
                `${object} = ${valToGraphDBValue(item, Array.isArray(options.type) ?
                  options.type[0] : options.type)}`
              ).join(' || ');
              whereClause.push(`FILTER(${filter})`);
            } else if (operator === "$gt" || operator === "$lt" || operator === "$ge" || operator === "$le") {
              whereClause.push(`FILTER(${object} ${Comparison[operator]} ${operand})`);
            } else if (operator === '$regex') {
              whereClause.push(`FILTER regex(${object}, ${operand})`);
            } else {
              throw new Error(`Model.find: Unknown combination: ${operator} with ${operand}`)
            }
          }
          // Deal with inner instances
          else {
            const innerQuery = options.type.generateFindQuery(val, {
              counters: {p: counters.p + 1, o: counters.o + 1},
              subjectNameOverride: object
            });
            whereClause.push(...innerQuery.where);
            // do not populate it right now, might do it later with .populate()
            // constructClause.push(...innerQuery.constructClause);
          }
        } else {
          whereClause.push(`FILTER(${object} = ${valToGraphDBValue(val, options.type)})`);
        }

      } else if (key !== '_id') {
        console.warn(`Ignoring key ${key} since it is not defined in the schema.`)
      }
    }

    const query = `${SPARQL.getSPARQLPrefixes()}\nCONSTRUCT {\n\t${constructClause.join('.\n\t')}\n} WHERE {\n\t${whereClause.join('\n\t')}\n}`;
    return {
      query, construct: constructClause, where: whereClause
    }
  }


  /**
   * Generate delete query of a document.
   * @private
   * @param {GraphDBDocument} doc
   * @param {number} [cnt=0]
   * @return {{query: string, where: string[]}}
   */
  generateDeleteQuery(doc, cnt = 0) {
    const subject = `:${this.schemaOptions.name}_${doc._id}`;
    const where = [`${subject} ?p_${cnt} ?o_${cnt}.`];

    for (const path of this.getCascadePaths()) {
      const innerDoc = doc.get(path);
      // This can be an array of docs
      if (Array.isArray(innerDoc)) {
        for (const doc of innerDoc) {
          const {where: innerWhere} = doc.model.generateDeleteQuery(doc, ++cnt);
          where.push(...innerWhere);
        }
      }
      // Generate query only if the inner document exists
      else if (innerDoc) {
        const {where: innerWhere} = innerDoc.model.generateDeleteQuery(innerDoc, ++cnt);
        where.push(...innerWhere);
      }
    }

    const query = `${SPARQL.getSPARQLPrefixes()}\n DELETE WHERE {\n\t${where.join('\n\t')}\n}`;

    return {
      query, where, cnt
    }

  }

  /**
   * Find documents from the model.
   * @param {{}} filter
   * @param {{populates}} options
   * @return {Promise.<GraphDBDocumentArray>}
   * @memberOf {GraphDBModel}
   * @example
   * ```js
   * // Find all documents for this model
   * await Model.find({});
   *
   * // Find with filter
   * await Model.find({first_name: "Lester"});
   *
   * // Find with nested filter
   * await Model.find({primary_contact: {first_name: "Lester"}});
   *
   * // Find with array filter, currently only supports $in
   * await Model.find({hobbies: {$in: ['coding', 'jogging']}});
   *
   * // Find with compare filter, supports $le, $lt, $ge, $gt
   * await Model.find({age: {$lt: 100, $gt: 20}}); // less than 100 and greater than 20
   *
   * await Model.find({age: {$le: 100, $ge: 20}}); // less or equal to 100 and greater or equal to 20
   *
   * // Find all documents with populates, support nested populates.
   * await Model.find({}, {
   *    populates: [
   *      'primary_contact', // Populate primary_contact
   *      'organization.primary_contact'  // Populate organization and organization.primary_contact
   *    ]
   * });
   * ```
   */
  async find(filter, options = {}) {
    const {populates = []} = options;
    const {query} = this.generateFindQuery(filter, {populates});

    const data = {};
    const resultInArray = new GraphDBDocumentArray();
    await GraphDB.sendConstructQuery(query, ({subject, predicate, object}) => {
      subject = getGraphDBAttribute(subject.value);
      predicate = SPARQL.getPrefixedURI(subject.value);
      object = object.termType === 'NamedNode' ? getGraphDBAttribute(object.value) : object.value;

      // The top instance
      if (subject.startsWith(this.schemaOptions.name)) {
        const option = this.internalKey2Option.get(predicate);
        // ignore unknown predicates
        if (!option)
          return;
        object = graphDBValueToJsValue(object, Array.isArray(option.type) ? option.type[0] : option.type);
        predicate = option.externalKey;

        const id = subject.slice(subject.lastIndexOf('_') + 1);
        if (!data[id]) data[id] = {};
        if (Array.isArray(option.type)) {
          if (!data[id][predicate]) data[id][predicate] = [];
          data[id][predicate].push(object);
        } else {
          data[id][predicate] = object;
        }
      }
    });

    const paths = objToPath(populates);

    for (const [id, topInstance] of Object.entries(data)) {
      const doc = new GraphDBDocument({
        data: {_id: id, ...topInstance},
        model: this
      });
      resultInArray.push(doc);
    }

    if (paths.length > 0)
      await resultInArray.populateMultiple(paths);

    return resultInArray;
  }

  /**
   * Find an document by ID in the model.
   * @param {string|number} id - ID of the document, usually represents as `_id`
   * @param {{populates}} [options]
   * @return {Promise<GraphDBDocument>}
   * @see {@link GraphDBModel.find} for further information
   * @example
   * ```js
   * // Same as
   * (await Model.find({_id: id}, {populates}))[0];
   *
   * // Find one document with _id = 1 and populate
   * Model.findById(1, {populates: ['primary_contact']});
   * ```
   */
  async findById(id, options) {
    const result = (await this.find({_id: id}, options));
    if (result.length > 1) console.warn(' Model.findById: There might be something wrong.')
    return result[0];
  }

  /**
   * Find one document in the model.
   * @param {{}} filter - The filter
   * @param {{populates}} [options]
   * @return {Promise<GraphDBDocument>}
   * @see {@link GraphDBModel.find} for further information
   * @example
   * ```js
   * // Same as
   * await (Model.find(filter, {populates}))[0];
   *
   * // Find one document and populate
   * Model.findOne({age: 50}, {populates: ['primary_contact']});
   * ```
   */
  async findOne(filter, options) {
    return (await this.find(filter, options))[0];
  }

  /**
   * Find one document and update.
   *
   * @param {{}} filter - The filter
   * @param {{}} update - The Update to the found document
   * @return {Promise<GraphDBDocument>}
   *
   * @example
   * ```js
   * // Find a document has _id = 1 and update the primary_contact.first_name to 'Lester'
   * // The document has smaller id will be updated if it finds multiple matched documents.
   * const doc = await Model.findOneAndUpdate({_id: 1}, {primary_contact: {first_name: 'Lester'}});
   * ```
   */
  async findOneAndUpdate(filter, update) {

    // Remove fields that are not in the schema.
    this.cleanData(update);

    // Find one
    const resultDoc = await this.findOne(filter);

    if (resultDoc) {
      Object.assign(resultDoc, update);
      await resultDoc.save();
    }

    return resultDoc;
  }

  /**
   * Find one document by ID and update
   * @param {string|number} id - The identifier
   * @param {{}} update -  The Update to the found document
   * @return {Promise<GraphDBDocument>}
   * @example
   * ```js
   * // Find a document has id = 1 and update the primary_contact.first_name to 'Lester'
   * const doc = await Model.findByIdAndUpdate(1, {primary_contact: {first_name: 'Lester'}});
   * ```
   */
  async findByIdAndUpdate(id, update) {
    return await this.findOneAndUpdate({_id: id}, update);
  }

  /**
   * Find all documents matched to the filter and delete.
   * @param {{}} filter - The filter.
   * @return {Promise<GraphDBDocumentArray>} - The deleted Documents.
   * @memberOf {GraphDBModel}
   * @example
   * ```js
   * // Find all documents have primary_contact.first_name equal to 'Lester' and delete them.
   * const doc = await Model.findAndDelete({primary_contact: {first_name: 'Lester'}});
   * ```
   */
  async findAndDelete(filter) {
    const populates = this.getCascadePaths();
    const docs = await this.find(filter, {populates});
    const whereClause = [];
    let cnt = 0;
    for (const doc of docs) {
      const {where} = this.generateDeleteQuery(doc, cnt++);
      whereClause.push(...where);
    }
    if (whereClause.length === 0)
      return docs;

    const query = `${SPARQL.getSPARQLPrefixes()}\n DELETE WHERE {\n\t${whereClause.join('\n\t')}\n}`;

    await GraphDB.sendUpdateQuery(query);
    return docs;
  }

  /**
   * Find one document matched to the filter and delete.
   * @param {{}} filter - The filter
   * @return {Promise<GraphDBDocument|undefined>} - The deleted document.
   * @example
   * ```js
   * // Find one document have primary_contact.first_name equal to 'Lester' and delete it.
   * // The document with smaller id will be deleted if found multiple documents.
   * const doc = await Model.findOneAndDelete({primary_contact: {first_name: 'Lester'}});
   * ```
   */
  async findOneAndDelete(filter) {
    const populates = this.getCascadePaths();
    const doc = await this.findOne(filter, {populates});
    if (!doc) return;
    const query = this.generateDeleteQuery(doc).query;
    await GraphDB.sendUpdateQuery(query);
    return doc;
  }

  /**
   * Find one document by ID and delete it.
   * @param {string|number} id - The identifier
   * @return {Promise<GraphDBDocument>} - The deleted document.
   * @example
   * ```js
   *  // Find one document has id 1 and delete it.
   *  const doc = await Model.findByIdAndDelete(1);
   * ```
   */
  async findByIdAndDelete(id) {
    return this.findOneAndDelete({_id: id});
  }

}


module.exports = {GraphDBModel};
