const {createGraphDBModel, Types} = require("../../utils/graphdb");

const GDBFieldTypeModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  label: {type: String, internalKey: ':hasLabel'}
}, {rdfTypes: [':FieldType'], name: 'fieldType'});

module.exports = {
  GDBFieldTypeModel
}