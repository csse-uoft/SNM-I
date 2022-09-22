const {createGraphDBModel, DeleteType} = require("../utils/graphdb");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBServiceProviderModel} = require("./serviceProvider");
const {GDBNeedModel} = require("./need");
const {GDBNeedOccurrenceModel} = require("./needOccurrence");
const {GDBServiceModel} = require("./service");
const {GDBProgramModel} = require("./program");

const GDBReferralModel = createGraphDBModel({
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  date: {type: Date, internalKey: ':hasDate'},
  modifiedAt: {type: Date, internalKey: 'modifiedAt'},
  modifiedBy: {type: GDBUserAccountModel, internalKey: 'modifiedBy'},
  referringServiceProvider: {type: GDBServiceProviderModel, internalKey: ':hasReferringServiceProvider'},
  receivingServiceProvider: {type: GDBServiceProviderModel, internalKey: ':hasReceivingServiceProvider'},
  note: {type: String, internalKey: 'hasNote'},
  description: {type: String, internalKey: 'hasDescription'},
  need: {type: GDBNeedModel, internalKey: ':hasNeed'},
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':hasNeedOccurrence'},
  service: {type: GDBServiceModel, internalKey: ':forService'},
  program: {type: GDBProgramModel, internalKey: ':forProgram'}
  // questionOccurrence: {type: [GDBQOModel],
  //   internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},

}, {
  rdfTypes: [':Referral'], name: 'referral'
});

module.exports = {
  GDBReferralModel
}