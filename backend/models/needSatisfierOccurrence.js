const {createGraphDBModel, Types, DeleteType} = require("graphdb-utils");
const {GDBNeedSatisfierModel} = require("./needSatisfier");
const {GDBAddressModel} = require("./address");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBNeedSatisfierOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBNeedSatisfierModel, internalKey: ':occurrenceOf'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristicOccurrences : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':NeedSatisfierOccurrence'], name: 'needSatisfierOccurrence'
});

module.exports = {
  GDBNeedSatisfierOccurrenceModel
}