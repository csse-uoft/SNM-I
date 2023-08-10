const {createGraphDBModel, getGraphDBModel} = require("../../utils/graphdb");
const {GDBOutcomeModel} = require("./outcome");
const {GDBServiceModel} = require("../service/service");
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBPersonModel} = require("../person");

const GDBOutcomeOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBOutcomeModel, internalKey: ':occurrenceOf'},
  person: {type: GDBPersonModel, internalKey: ':hasPerson'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  serviceMatch: {type: [GDBServiceModel], internalKey: ':hasServiceMatch'},
  characteristicOccurrence: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
}, {
  rdfTypes: [':OutcomeOccurrence'], name: 'outcomeOccurrence'
});

module.exports = {
  GDBOutcomeOccurrenceModel
}
