const {createGraphDBModel, Types} = require("../../utils/graphdb");
const {GDBNeedSatisfierModel} = require("../needSatisfier");
const {GDBCharacteristicModel} = require("../ClientFunctionalities/characteristic");

const GDBNeedModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  changeType: {type: String, internalKey: ':hasChangeType'},
  needSatisfier: {type: [GDBNeedSatisfierModel], internalKey: ':hasNeedsatisfier'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristic: {type: GDBCharacteristicModel, internalKey: ':forCharacteristic'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
}, {
  rdfTypes: [':Need'], name: 'need'
});

module.exports = {
  GDBNeedModel
}