const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBPersonModel} = require("./person");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBQuestionModel} = require("./ClientFunctionalities/question");
const {GDBOutcomeModel} = require("./outcome");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");

const GDBClientAssessmentModel = createGraphDBModel({
  characteristicOccurrence: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  description: {type: String, internalKey: ':hasDescription'},
  outcome: {type: [GDBOutcomeModel], internalKey: ':hasOutcome'},
  need: {type: [GDBNeedModel], internalKey: ':hasNeed'},
  note: {type: String, internalKey: ':hasNote'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  userAccount: {type: GDBUserAccountModel, internalKey: ':withUser'},
  person: {type: GDBPersonModel, internalKey: ':hasPerson'},
  need: {type: [GDBNeedModel], internalKey: ':hasNeed'},
  needOccurrence: {type: [GDBNeedOccurrenceModel], internalKey: ':hasNeedOccurrence'},
  // outcome: {type: [GDBOutcomeModel], internalKey: ':hasOutcome'},
  question: {type: [GDBQuestionModel], internalKey: ':hasQuestion'},
}, {
  rdfTypes: [':ClientAssessment'], name: 'clientAssessment'
});

module.exports = {
  GDBClientAssessmentModel
}
