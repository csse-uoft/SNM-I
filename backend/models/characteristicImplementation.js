const {createGraphDBModel, Types} = require("../utils/graphdb");

/**
 * GDBCIModel stands for GDB - Characteristic Implementation - Model
 * @type {GDBUtils.GraphDBModelConstructor}
 */
const GDBCIModel = createGraphDBModel({
  label: {type: String, internalKey: ':hasLabel'},
  multipleValues:{type: Boolean, internalKey: ':hasMultipleValues'},
  valueDataType:{type: Types.NamedIndividual, internalKey: ':hasValueDataType'},
  fieldType:{type: GDBFieldTypeModel, internalKey: ':hasFieldType'},
  options:{type: [Types.NamedIndividual], internalKey: ':hasOption'},
  required:{type: Boolean, internalKey: ':isRequired'},
  optionsFromClass:{type: Types.NamedIndividual, internalKey: ''},
}, {
  rdfTypes: ['snmi:CharacteristicImplementation'], name: 'characteristicImplementation'
});

module.exports = {
  GDBCIModel
}