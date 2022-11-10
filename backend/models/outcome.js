const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBCharacteristicModel} = require("./ClientFunctionalities/characteristic");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBOutcomeModel = createGraphDBModel({
  name: {type: String, internalKey: ':hasName'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristic: {type: GDBCharacteristicModel, internalKey: ':hasCharacteristic'},
  code: {type: [Types.NamedIndividual], internalKey: ':hasCode'},
  characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':Outcome'], name: 'outcome'
});

module.exports = {
  GDBOutcomeModel
}