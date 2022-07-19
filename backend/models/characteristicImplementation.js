const {createGraphDBModel, Types} = require("../utils/graphdb");

const GDBCharacteristicImplementationModel = createGraphDBModel({
  // name: {type: String, internalKey: 'cp:hasName'},
  // description: {type: String, internalKey: 'cids:hasDescription'},
  // codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
}, {
  rdfTypes: ['snmi:CharacteristicImplementation'], name: 'characteristicImplementation'
});

module.exports = {
  GDBCharacteristicImplementationModel
}