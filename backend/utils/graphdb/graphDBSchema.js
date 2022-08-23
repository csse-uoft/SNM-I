/**
 * Something like Mongoose for GraphDB.
 * Supported data types: `String, Number, Array, Date, NamedIndividual`
 *
 * Default prefix: 'has'
 * Default plural: '-s' for Array
 */
const {GraphDBDocument} = require('./graphDBDocument');
const {GraphDBModel} = require('./graphDBModel');
const {Types, defaultOptions, DeleteType, regexBuilder} = require('./helpers');

const store = {};


/**
 * @alias GDSchemaOptions
 * @typedef SchemaOptions
 * @property {string} name - The prefix of the created documents' identifier.
 *    e.g. if `name="primary_contact"`, the new created document will have id `:primary_contact_1`
 * @property {string[]} rdfTypes - The list of value in rdf:type.
 *    e.g. `[Types.NamedIndividual, ":primary_contact"]` => `some_instance rdf:type owl:NamedIndividual, :primary_contact.`
 * @example
 * ```js
 * {name: 'primary_contact', rdfTypes: [Types.NamedIndividual, ':primary_contact']}
 * ```
 */


/**
 * @typedef GraphDBPropertyOptions
 * @property {String|Number|Date|NamedIndividual|Boolean} type - Data type,
 * @property {string} [prefix=has_] - The prefix add to each predicate,
 * @property {string} [suffix=s] - For array datatype only, the suffix append to the external key,
 * @property {string} [internalKey=null] - The internal key, internal keys are used in GraphDB,
 * @property {string} [externalKey=null] - The external key, external keys are used in javascript. (documents, filters, populates)
 * @property {string} [onDelete=DeleteType.NON_CASCADE] - The delete operation on nested models, default to non cascade.
 */

/**
 *
 * @param {object.<string, GraphDBPropertyOptions|String|Number|Date|NamedIndividual|Boolean>} schema - {@link GraphDBPropertyOptions}
 * @param {SchemaOptions} schemaOptions
 * @return {GraphDBModel|function(data:object):GraphDBDocument}
 * @function
 */
function createGraphDBModel(schema, schemaOptions) {
  if (!schema) throw new Error('schema must be provided');

  const externalKey2Option = new Map();
  const internalKey2Option = new Map();

  // nested model information
  const instancePrefix2Model = new Map();

  // if type.schemaOptions.name does not contain prefix, default to empty prefix `:`
  if (!schemaOptions.name.includes(':')) {
    schemaOptions.name = `:${schemaOptions.name}`
  }

  for (let [key, options] of Object.entries(schema)) {
    // Map to our data structure with some predefined options
    if (typeof options !== "object" || Array.isArray(options)) {
      options = {...defaultOptions, type: options};
    } else {
      options = {...defaultOptions, ...options};
    }

    const internalKey = options.internalKey || `${options.prefix}${key}`;
    const externalKey = options.externalKey || (Array.isArray(options.type) ? `${key}${options.suffix}` : key);

    options = {...options, internalKey, externalKey, schemaKey: key};

    externalKey2Option.set(externalKey, options);
    internalKey2Option.set(internalKey, options);

    if ((typeof options.type === "function" && options.type.name === 'Model')
      || Array.isArray(options.type) && typeof options.type[0] === "function" && options.type[0].name === 'Model') {

      let type = options.type;
      if (Array.isArray(type)) {
        type = type[0]
      }
      instancePrefix2Model.set(type.schemaOptions.name, type);
      for (const [innerKey, innerVal] of type.instancePrefix2Model.entries()) {
        instancePrefix2Model.set(innerKey, innerVal);
      }
    }
  }

  // The instance of an owl:Class must be an owl:NamedIndividual
  if (!schemaOptions.rdfTypes.includes(Types.NamedIndividual)) {
    schemaOptions.rdfTypes.unshift(Types.NamedIndividual);
  }
  const model = GraphDBModel.init({
    externalKey2Option, internalKey2Option, instancePrefix2Model, schemaOptions, schema
  });
  // Store it internally
  store[schemaOptions.name] = model
  return model;
}

function getGraphDBModel(name) {
  return store[name];
}

module.exports = {Types, DeleteType, regexBuilder, createGraphDBModel, getGraphDBModel}
