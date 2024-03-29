const {createGraphDBModel, DeleteType} = require("graphdb-utils");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBServiceProviderModel} = require("./serviceProvider");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");
const {GDBServiceModel} = require("./service/service");
const {GDBProgramModel} = require("./program/program");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBServiceOccurrenceModel} = require("./service/serviceOccurrence");
const {GDBProgramOccurrenceModel} = require("./program/programOccurrence");
const {GDBAddressModel} = require('./address');

const GDBReferralModel = createGraphDBModel({
  referralType: {type: String, internalKey: ':hasType'},
  referralStatus: {type: String, internalKey: ':hasReferralStatus'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  date: {type: Date, internalKey: ':hasDate'},
  referringServiceProvider: {type: GDBServiceProviderModel, internalKey: ':hasReferringServiceProvider'},
  receivingServiceProvider: {type: GDBServiceProviderModel, internalKey: ':hasReceivingServiceProvider'},
  note: {type: String, internalKey: ':hasNote'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':hasNeedOccurrence'},
  service: {type: GDBServiceModel, internalKey: ':forService'},
  serviceOccurrence: {type: GDBServiceOccurrenceModel, internalKey: ':hasServiceOccurrence'},
  program: {type: GDBProgramModel, internalKey: ':forProgram'},
  programOccurrence: {type: GDBProgramOccurrenceModel, internalKey: ':hasProgramOccurrence'},
  characteristicOccurrences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
  idInPartnerDeployment: {type: String, internalKey: ':hasIdInPartnerDeployment'},
}, {
  rdfTypes: [':Referral'], name: 'referral'
});

module.exports = {
  GDBReferralModel
}
