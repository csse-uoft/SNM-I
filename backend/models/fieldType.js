const {createGraphDBModel} = require("../utils/graphdb");

const GDBFieldTypeModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},

},{rdfTypes: [':FieldType'], name:'fieldType'})

module.exports = {
  GDBFieldTypeModel
}