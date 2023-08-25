const {createGraphDBModel, Types} = require("graphdb-utils");
const {GDBCharacteristicModel} = require("./ClientFunctionalities/characteristic");

const GDBNeedSatisfierModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristics: {type: [GDBCharacteristicModel], internalKey: ':forCharacteristic'},
  description: {type: String, internalKey: 'cids:hasDescription'}
}, {
  rdfTypes: [':NeedSatisfier'], name: 'needSatisfier'
});

module.exports = {
  GDBNeedSatisfierModel
}