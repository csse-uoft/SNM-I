const {createGraphDBModel, Types, DeleteType} = require("graphdb-utils");
const {GDBCharacteristicModel} = require("./characteristic");

/**
 * GDBCOModel stands for GDB - Characteristic Occurrence - Model
 */
const GDBCOModel = createGraphDBModel({
  dataStringValue: {type: String, internalKey: ':hasStringValue'},
  dataNumberValue: {type: Number, internalKey: ':hasNumberValue'},
  dataBooleanValue: {type: Boolean, internalKey: ':hasBooleanValue'},
  dataDateValue: {type: Date, internalKey: ':hasDateValue'},
  objectValue: {type: Types.NamedIndividual, internalKey: ':hasObjectValue'},
  multipleObjectValues: {type: [Types.NamedIndividual], internalKey: ':hasMultipleObjectValue'},
  occurrenceOf: {type: GDBCharacteristicModel, internalKey: ':occurrenceOf'},
}, {
  rdfTypes: [':CharacteristicOccurrence'], name: 'characteristicOccurrence'
});

module.exports = {
  GDBCOModel
}