const {GDBAddressModel} = require('../address')
const {createGraphDBModel, Types, DeleteType} = require("../../utils/graphdb");
const {GDBServiceModel} = require("./service");
const {GDBNeedSatisfierModel} = require("../needSatisfier");

const GDBServiceOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBServiceModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'},
  hoursOfOperation: {type: Types.NamedIndividual, internalKey: ':hasOperatingHours'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  needSatisfierOccurrence: {type: GDBNeedSatisfierModel, internalKey: ':hasNeedSatisfierOccurrence'},
  description: {type: String, internalKey: ':hasDescription'}

  // questionOccurrence: {type: [GDBQOModel],
  //   internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},

}, {
  rdfTypes: [':ServiceOccurrence'], name: 'serviceOccurrence'
});

module.exports = {
  GDBServiceOccurrenceModel
}