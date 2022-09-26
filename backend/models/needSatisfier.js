const {createGraphDBModel, Types} = require("../utils/graphdb");

const GDBNeedSatisfierModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},

}, {
  rdfTypes: [':NeedSatisfier'], name: 'needSatisfier'
});

module.exports = {
  GDBNeedSatisfierModel
}