const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBPersonModel} = require("./person");
const {GDBNeedModel} = require("./need/need");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBOutcomeModel} = require("./outcome/outcome");
const {GDBOutcomeOccurrenceModel} = require("./outcome/outcomeOccurrence");

const GDBClientAssessmentModel = createGraphDBModel({
  characteristicOccurrence: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  description: {type: String, internalKey: ':hasDescription'},
  outcome: {type: [GDBOutcomeModel], internalKey: ':hasOutcome'},
  // If an outcome is added, outcome occurrence is automatically created and associated to the client.
  outcomeOccurrence: {type: [GDBOutcomeOccurrenceModel], internalKey: ':hasOutcomeOccurrence', onDelete: DeleteType.CASCADE},
  note: {type: String, internalKey: ':hasNote'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  userAccount: {type: GDBUserAccountModel, internalKey: ':withUser'},
  person: {type: GDBPersonModel, internalKey: ':hasPerson'},
  need: {type: GDBNeedModel, internalKey: ':hasNeed'},
}, {
  rdfTypes: [':ClientAssessment'], name: 'clientAssessment'
});

module.exports = {
  GDBClientAssessmentModel
}
