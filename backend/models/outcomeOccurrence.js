const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBCharacteristicModel} = require("./ClientFunctionalities/characteristic");
const {GDBOutcomeModel} = require("./outcome");

const GDBOutcomeOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBOutcomeModel, internalKey: 'occurrenceOf'},
  startDate:{type: Date, internalKey: 'hasStartDate'},
  endDate: {type: Date, internalKey: 'hasEndDate'}
}, {
  rdfTypes: [':OutcomeOccurrence'], name: 'outcomeOccurrence'
});

module.exports = {
  GDBOutcomeOccurrenceModel
}