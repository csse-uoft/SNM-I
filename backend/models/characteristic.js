const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBCIModel} = require("./characteristicImplementation");

const GDBCharacteristicModel = createGraphDBModel({
  //name: {type: String, internalKey: 'cp:hasName'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  CI : {type: GDBCIModel, internalKey: ':CharacteristicImplementation'},
}, {
  rdfTypes: [':Characteristic'], name: 'characteristic'
});

module.exports = {
  GDBCharacteristicModel
}