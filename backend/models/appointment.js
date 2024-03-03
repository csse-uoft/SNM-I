const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBPersonModel} = require("./person");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBAddressModel} = require('./address');

const GDBAppointmentModel = createGraphDBModel({
  client: {type: GDBClientModel, internalKey: ':forClient'},
  datetime: {type: Date, internalKey: ':hasDatetime'},
  person: {type: GDBPersonModel, internalKey: ':hasPerson'},
  user: {type: GDBUserAccountModel, internalKey: ':withUser'},
  characteristicOccurrences : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},

  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  appointmentName: {type: String, internalKey: ':hasName'},
}, {
  rdfTypes: [':Appointment'], name: 'appointment'
});

module.exports = {
  GDBAppointmentModel
}
