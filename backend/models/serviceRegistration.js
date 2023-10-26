const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBServiceOccurrenceModel} = require("./service/serviceOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBReferralModel} = require("./referral");
const {GDBAppointmentModel} = require("./appointment");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");
const {GDBAddressModel} = require('./address');

const GDBServiceRegistrationModel = createGraphDBModel({
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':forNeedOccurrence'},
  serviceOccurrence: {type: GDBServiceOccurrenceModel, internalKey: ':hasServiceOccurrence'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  referral: {type: GDBReferralModel, internalKey: ':hasReferral'},
  appointment: {type: GDBAppointmentModel, internalKey: ':hasAppointment'},
  characteristicOccurrences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
}, {
  rdfTypes: [':ServiceRegistration'], name: 'serviceRegistration'
});

module.exports = {
  GDBServiceRegistrationModel
}
