const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBCharacteristicModel} = require("./ClientFunctionalities/characteristic");

const GDBNeedSatisfierModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristic: {type: [GDBCharacteristicModel], internalKey: ':forCharacteristic'},
  description: {type: String, internalKey: ':hasDescription'}
}, {
  rdfTypes: [':NeedSatisfier'], name: 'needSatisfier'
});

module.exports = {
  GDBNeedSatisfierModel
}