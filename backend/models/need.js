const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBNeedsatisfierModel} = require("./needSatisfier");
const {GDBCharacteristicModel} = require("./ClientFunctionalities/characteristic");

const GDBNeedModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  changeType: {type: String, internalKey: ':hasChangeType'},
  needSatisfier: {type: GDBNeedsatisfierModel, internalKey: ':hasNeedsatisfier'},
  characteristic: {type: GDBCharacteristicModel, internalKey: ':forCharacteristic'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
}, {
  rdfTypes: [':Need'], name: 'need'
});

module.exports = {
  GDBNeedModel
}