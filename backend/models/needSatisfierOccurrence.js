const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBNeedSatisfierModel} = require("./needSatisfier");
const {GDBAddressModel} = require("./address");

const GDBNeedSatisfierOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBNeedSatisfierModel, internalKey: ':occurrenceOf'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  description: {type: String, internalKey: ':hasDescription'}
}, {
  rdfTypes: [':NeedSatisfierOccurrence'], name: 'needSatisfierOccurrence'
});

module.exports = {
  GDBNeedSatisfierOccurrenceModel
}