const {createGraphDBModel, Types} = require("../utils/graphdb");

const GDBNeedSatisfyerModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},

}, {
  rdfTypes: [':NeedSatisfyer'], name: 'needSatisfyer'
});

module.exports = {
  GDBNeedSatisfyerModel
}