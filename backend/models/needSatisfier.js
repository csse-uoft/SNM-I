const {createGraphDBModel, Types} = require("../utils/graphdb");

const GDBNeedsatisfierModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},

}, {
  rdfTypes: [':Needsatisfier'], name: 'needsatisfier'
});

module.exports = {
  GDBNeedsatisfierModel
}