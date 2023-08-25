const {createGraphDBModel, Types} = require("graphdb-utils");

/**
 * This is the option Model.
 */
const GDBOptionModel = createGraphDBModel({
  label: {type: String, internalKey: ':hasLabel'},
  dataValue: {type: String, internalKey: ':hasDataValue'},
  objectValue: {type: Types.NamedIndividual, internalKey: ':hasObjectValue'}

}, {rdfTypes: [':Option'], name: 'option'})

module.exports = {
  GDBOptionModel
}