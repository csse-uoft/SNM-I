const {createGraphDBModel, Types} = require("../../utils/graphdb");
const {GDBCharacteristicModel} = require("../ClientFunctionalities/characteristic");

const GDBOutcomeModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  changeType: {type: String, internalKey: ':hasChangeType'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristic: {type: GDBCharacteristicModel, internalKey: ':forCharacteristic'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
}, {
  rdfTypes: [':Outcome'], name: 'outcome'
});

module.exports = {
  GDBOutcomeModel
}
