const {createGraphDBModel, Types, DeleteType} = require("../../utils/graphdb");
const {GDBFieldTypeModel} = require("./fieldType");
const {GDBOptionModel} = require("./option");

/**
 * GDBCIModel stands for GDB - characteristics Implementation - Model
 * @type {GDBUtils.GraphDBModelConstructor}
 */

const GDBCIModel = createGraphDBModel({
  label: {type: String, internalKey: ':hasLabel'},
  multipleValues: {type: Boolean, internalKey: ':hasMultipleValues'},
  valueDataType: {type: Types.NamedIndividual, internalKey: ':hasValueDataType'},
  fieldType: {type: GDBFieldTypeModel, internalKey: ':hasFieldType'},
  // store options as [{}, {}, {}]
  option: {type: [GDBOptionModel], internalKey: ':hasOption', onDelete: DeleteType.CASCADE},
  //required:{type: Boolean, internalKey: ':isRequired'},
  optionsFromClass: {type: Types.NamedIndividual, internalKey: ':hasOptionsFromClass'},
}, {
  rdfTypes: [':CharacteristicImplementation'], name: 'characteristicImplementation'
});

module.exports = {
  GDBCIModel
}