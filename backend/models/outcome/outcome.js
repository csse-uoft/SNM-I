const {createGraphDBModel, Types, DeleteType} = require("graphdb-utils");
const {GDBCharacteristicModel} = require("../ClientFunctionalities/characteristic");
const {GDBAddressModel} = require('../address');

const GDBOutcomeModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  changeType: {type: String, internalKey: ':hasChangeType'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristic: {type: GDBCharacteristicModel, internalKey: ':forCharacteristic'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':Outcome'], name: 'outcome'
});

module.exports = {
  GDBOutcomeModel
}
