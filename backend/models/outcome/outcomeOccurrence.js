const {createGraphDBModel, getGraphDBModel} = require("../../utils/graphdb");
const {GDBOutcomeModel} = require("./outcome");
const {GDBServiceModel} = require("../service/service");
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");

const GDBOutcomeOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBOutcomeModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  acuity: {type: String, internalKey: ':hasAcuity'},
  serviceMatch: {type: [GDBServiceModel], internalKey: ':hasServiceMatch'},
  characteristicOccurrence: {type: GDBCOModel, internalKey: ':hasCharacteristicOccurrence'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
}, {
  rdfTypes: [':OutcomeOccurrence'], name: 'outcomeOccurrence'
});

module.exports = {
  GDBOutcomeOccurrenceModel
}
