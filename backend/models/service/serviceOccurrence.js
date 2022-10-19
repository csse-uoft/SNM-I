const {GDBAddressModel} = require('../address')
const {createGraphDBModel, Types, DeleteType} = require("../../utils/graphdb");
const {GDBServiceModel} = require("./service");
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBNeedSatisfierOccurrenceModel} = require("../needSatisfierOccurrence");
const {GDBNeedSatisfierModel} = require("../needSatisfier");

const GDBServiceOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBServiceModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'},
  hoursOfOperation: {type: Types.NamedIndividual, internalKey: ':hasOperatingHours'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  needSatisfier: {type: [GDBNeedSatisfierModel], internalKey: 'hasNeedSatisfier'},
  needSatisfierOccurrence: {type: [GDBNeedSatisfierOccurrenceModel], internalKey: ':hasNeedSatisfierOccurrence'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristicOccurrence: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':ServiceOccurrence'], name: 'serviceOccurrence'
});

module.exports = {
  GDBServiceOccurrenceModel
}