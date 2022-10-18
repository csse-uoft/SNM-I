const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBPersonModel} = require("./person");

const GDBAppointmentModel = createGraphDBModel({
  client: {type: GDBClientModel, internalKey: ':forClient'},
  datetime: {type: Date, internalKey: ':hasDatetime'},
  person: {type: GDBPersonModel, internalKey: ':hasPerson'},
  user: {type: GDBUserAccountModel, internalKey: ':withUser'}
}, {
  rdfTypes: [':Appointment'], name: 'appointment'
});

module.exports = {
  GDBAppointmentModel
}