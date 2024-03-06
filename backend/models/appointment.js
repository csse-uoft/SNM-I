const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBPersonModel} = require("./person");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBAddressModel} = require('./address');
const { GDBReferralModel } = require("./referral");

const GDBAppointmentModel = createGraphDBModel({
  client: {type: GDBClientModel, internalKey: ':forClient'},
  datetime: {type: Date, internalKey: ':hasDatetime'},
  person: {type: GDBPersonModel, internalKey: ':hasPerson'},
  user: {type: GDBUserAccountModel, internalKey: ':withUser'},
  status: {type: String, internalKey: ':hasAppointmentStatus'},
  referral: {type: GDBReferralModel, internalKey: ':hasReferral'},
  characteristicOccurrences : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
  idInPartnerDeployment: {type: String, internalKey: ':hasIdInPartnerDeployment'},
}, {
  rdfTypes: [':Appointment'], name: 'appointment'
});

module.exports = {
  GDBAppointmentModel
}
