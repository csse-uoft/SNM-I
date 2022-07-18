const {createGraphDBModel, Types} = require("../utils/graphdb");

const GDBCharacteristicModel = createGraphDBModel({
  name: {type: String, internalKey: 'cp:hasName'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
}, {
  rdfTypes: ['snmi:Characteristic'], name: 'characteristic'
});

module.exports = {
  GDBCharacteristicModel
}