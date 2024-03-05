const {createGraphDBModel, DeleteType, Types, getGraphDBModel} = require("graphdb-utils");
const {GDBProgramOccurrenceModel} = require("./program/programOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBReferralModel} = require("./referral");
const {GDBAppointmentModel} = require("./appointment");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");
const {GDBAddressModel} = require('./address');

const GDBProgramRegistrationModel = createGraphDBModel({
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':forNeedOccurrence'},
  programOccurrence: {type: GDBProgramOccurrenceModel, internalKey: ':hasProgramOccurrence'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  referral: {type: GDBReferralModel, internalKey: ':hasReferral'},
  appointment: {type: GDBAppointmentModel, internalKey: ':hasAppointment'},
  status: {type: String, internalKey: ':hasRegistrationStatus'},
  characteristicOccurrences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':ProgramRegistration'], name: 'programRegistration'
});

module.exports = {
  GDBProgramRegistrationModel
}
