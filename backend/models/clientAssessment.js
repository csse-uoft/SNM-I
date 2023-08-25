const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBPersonModel} = require("./person");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBOutcomeModel} = require("./outcome/outcome");
const {GDBOutcomeOccurrenceModel} = require("./outcome/outcomeOccurrence");
const {GDBNeedModel} = require("./need/need");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");
const {GDBQuestionModel} = require("./ClientFunctionalities/question");

const GDBClientAssessmentModel = createGraphDBModel({
  characteristicOccurrence: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  description: {type: String, internalKey: ':hasDescription'},
  need: {type: [GDBNeedModel], internalKey: ':hasNeed'},
  note: {type: String, internalKey: ':hasNote'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  userAccount: {type: GDBUserAccountModel, internalKey: ':withUser'},
  person: {type: GDBPersonModel, internalKey: ':hasPerson'},
  outcome: {type: [GDBOutcomeModel], internalKey: ':hasOutcome'},
  outcomeOccurrence: {type: [GDBOutcomeOccurrenceModel], internalKey: ':hasOutcomeOccurrence'},
  need: {type: [GDBNeedModel], internalKey: ':hasNeed'},
  needOccurrence: {type: [GDBNeedOccurrenceModel], internalKey: ':hasNeedOccurrence'},
  question: {type: [GDBQuestionModel], internalKey: ':hasQuestion'},
}, {
  rdfTypes: [':ClientAssessment'], name: 'clientAssessment'
});

module.exports = {
  GDBClientAssessmentModel
}
