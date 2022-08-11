const {createGraphDBModel, Types, DeleteType} = require("../../utils/graphdb");
const {GDBCIModel} = require("./characteristicImplementation");

const GDBCharacteristicModel = createGraphDBModel({
  description: {type: String, internalKey: 'cids:hasDescription'},
  name: {type: String, internalKey: ':hasName'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  predefinedProperty: {type: String, internalKey: 'snmi:hasPredefinedProperty'},
  isPredefined: {type: Boolean, internalKey: 'snmi:isPredefined'},
  implementation: {type: GDBCIModel, internalKey: ':hasCharacteristicImplementation', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':characteristics'], name: 'characteristic'
});

module.exports = {
  GDBCharacteristicModel
}