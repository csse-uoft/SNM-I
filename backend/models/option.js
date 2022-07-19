const {createGraphDBModel, Types} = require("../utils/graphdb");

const GDBOptionModel = createGraphDBModel({
  label: {type: String, internalKey: ':hasLabel'},
  dataValue: {type: String, internalKey: ':hasDataValue'},
  objectValue: {type: Types.NamedIndividual, internalKey: ':hasObjectValue'}

},{rdfTypes: [':Option'], name:'option'})

module.exports = {
  GDBOptionModel
}