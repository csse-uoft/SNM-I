const {createGraphDBModel, Types, DeleteType} = require("graphdb-utils");
const {GDBFieldTypeModel} = require("./fieldType");
const {GDBOptionModel} = require("./option");

/**
 * GDBCIModel stands for GDB - characteristics Implementation - Model
 */

const GDBFIIModel = createGraphDBModel({
  label: {type: String, internalKey: ':hasLabel'},
  multipleValues: {type: Boolean, internalKey: ':hasMultipleValues'},
  valueDataType: {type: Types.NamedIndividual, internalKey: ':hasValueDataType'},
  fieldType: {type: GDBFieldTypeModel, internalKey: ':hasFieldType'},
  // store options as [{}, {}, {}]
  options: {type: [GDBOptionModel], internalKey: ':hasOption', onDelete: DeleteType.CASCADE},
  //required:{type: Boolean, internalKey: ':isRequired'},
  optionsFromClass: {type: Types.NamedIndividual, internalKey: ':hasOptionsFromClass'},
}, {
  rdfTypes: [':FormItemImplementation'], name: 'formItemImplementation'
});

module.exports = {
  GDBFIIModel
}