const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBNeedSatisfierModel} = require("./needSatisfier");
const {GDBAddressModel} = require("./address");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBNeedSatisfierOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBNeedSatisfierModel, internalKey: ':occurrenceOf'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':NeedSatisfierOccurrence'], name: 'needSatisfierOccurrence'
});

module.exports = {
  GDBNeedSatisfierOccurrenceModel
}