const {createGraphDBModel, Types} = require("graphdb-utils");
const {GDBNeedSatisfierModel} = require("../needSatisfier");
const {GDBCharacteristicModel} = require("../ClientFunctionalities/characteristic");

const GDBNeedModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  changeType: {type: String, internalKey: ':hasChangeType'},
  needSatisfiers: {type: [GDBNeedSatisfierModel], internalKey: ':hasNeedsatisfier'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristic: {type: GDBCharacteristicModel, internalKey: ':forCharacteristic'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  kindOf: {type: [() => GDBNeedModel], internalKey: ':kindOf'},
}, {
  rdfTypes: [':Need'], name: 'need'
});

module.exports = {
  GDBNeedModel
}