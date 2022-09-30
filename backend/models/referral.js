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
  referringServiceProvider: {type: GDBServiceProviderModel, internalKey: ':hasReferringServiceProvider'},
  receivingServiceProvider: {type: GDBServiceProviderModel, internalKey: ':hasReceivingServiceProvider'},
  note: {type: String, internalKey: 'hasNote'},
  description: {type: String, internalKey: 'hasDescription'},
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':hasNeedOccurrence'},
  service: {type: GDBServiceModel, internalKey: ':forService'},

}, {
  rdfTypes: [':Referral'], name: 'referral'
});

module.exports = {
  GDBReferralModel
}