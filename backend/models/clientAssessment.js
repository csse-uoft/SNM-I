const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBPersonModel} = require("./person");
const {GDBNeedModel} = require("./need/need");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBOutcomeModel} = require("./outcome/outcome");

const GDBClientAssessmentModel = createGraphDBModel({
  characteristicOccurrence: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  description: {type: String, internalKey: ':hasDescription'},
  outcome: {type: [GDBOutcomeModel], internalKey: ':hasOutcome'},
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
