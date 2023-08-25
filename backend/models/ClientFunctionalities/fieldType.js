const {createGraphDBModel, Types} = require("graphdb-utils");

/**
 * This is the Field Type Model
 */
const GDBFieldTypeModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  label: {type: String, internalKey: ':hasLabel'}
}, {rdfTypes: [':FieldType'], name: 'fieldType'});

module.exports = {
  GDBFieldTypeModel
}