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
const {GDBAddressModel} = require('./address');

const GDBClientAssessmentModel = createGraphDBModel({
  characteristicOccurrences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  description: {type: String, internalKey: ':hasDescription'},
  needs: {type: [GDBNeedModel], internalKey: ':hasNeed'},
  note: {type: String, internalKey: ':hasNote'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  userAccount: {type: GDBUserAccountModel, internalKey: ':withUser'},
  person: {type: GDBPersonModel, internalKey: ':hasPerson'},
  outcomes: {type: [GDBOutcomeModel], internalKey: ':hasOutcome'},
  outcomeOccurrences: {type: [GDBOutcomeOccurrenceModel], internalKey: ':hasOutcomeOccurrence'},
  needOccurrences: {type: [GDBNeedOccurrenceModel], internalKey: ':hasNeedOccurrence'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  questions: {type: [GDBQuestionModel], internalKey: ':hasQuestion'},
}, {
  rdfTypes: [':ClientAssessment'], name: 'clientAssessment'
});

module.exports = {
  GDBClientAssessmentModel
}
