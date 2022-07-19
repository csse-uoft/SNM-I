const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBCharacteristicImplementationModel} = require("./characteristicImplementation");

const GDBCharacteristicModel = createGraphDBModel({
  //name: {type: String, internalKey: 'cp:hasName'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristicImplementation : {type: GDBCharacteristicImplementationModel, internalKey: 'snmi:CharacteristicImplementation'},
}, {
  rdfTypes: ['snmi:Characteristic'], name: 'characteristic'
});

module.exports = {
  GDBCharacteristicModel
}