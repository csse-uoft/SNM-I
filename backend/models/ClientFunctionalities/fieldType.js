const {createGraphDBModel, Types} = require("../../utils/graphdb");

/**
 * This is the Field Type Model
 * @type {GDBUtils.GraphDBModelConstructor}
 */
const GDBFieldTypeModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  label: {type: String, internalKey: ':hasLabel'}
}, {rdfTypes: [':FieldType'], name: 'fieldType'});

module.exports = {
  GDBFieldTypeModel
}