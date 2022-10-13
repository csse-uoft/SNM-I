const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBCharacteristicModel} = require("./ClientFunctionalities/characteristic");

const GDBOutcomeModel = createGraphDBModel({
  name: {type: String, internalKey: ':hasName'},
  description: {type: String, internalKey: ':hasDescription'},
  characteristic: {type: GDBCharacteristicModel, internalKey: ':hasCharacteristic'},
  code: {type: [Types.NamedIndividual], internalKey: ':hasCode'},
}, {
  rdfTypes: [':Outcome'], name: 'outcome'
});

module.exports = {
  GDBOutcomeModel
}