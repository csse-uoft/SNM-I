const {createGraphDBModel, Types} = require("../../utils/graphdb");
const {GDBCIModel} = require("./characteristicImplementation");

const GDBCharacteristicModel = createGraphDBModel({
  description: {type: String, internalKey: 'cids:hasDescription'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  ci : {type: GDBCIModel, internalKey: 'snmi:CharacteristicImplementation'},
}, {
  rdfTypes: ['snmi:Characteristic'], name: 'characteristic'
});

module.exports = {
  GDBCharacteristicModel
}