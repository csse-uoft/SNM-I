const {GDBAddressModel} = require('../address')
const {createGraphDBModel, Types, DeleteType} = require("graphdb-utils");
const {GDBServiceModel} = require("./service");
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBNeedSatisfierOccurrenceModel} = require("../needSatisfierOccurrence");
const {GDBNeedSatisfierModel} = require("../needSatisfier");

const GDBServiceOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBServiceModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'},
  hoursOfOperation: {type: Types.NamedIndividual, internalKey: ':hasOperatingHours', onDelete: DeleteType.CASCADE},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
  needSatisfiers: {type: [GDBNeedSatisfierModel], internalKey: ':hasNeedSatisfier'},
  // needSatisfierOccurrence: {type: [GDBNeedSatisfierOccurrenceModel], internalKey: ':hasNeedSatisfierOccurrence', onDelete: DeleteType.CASCADE},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristicOccurrences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':ServiceOccurrence'], name: 'serviceOccurrence'
});

module.exports = {
  GDBServiceOccurrenceModel
}