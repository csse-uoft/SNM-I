const {createGraphDBModel} = require("../utils/graphdb");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBNeedModel} = require("./need");

const GDBNeedOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBNeedModel, internalKey: ':occurrenceOf'}
}, {
  rdfTypes: [':NeedOccurrence'], name: 'needOccurrence'
});

module.exports = {
  GDBNeedOccurrenceModel
}