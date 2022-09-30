const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");

const GDBAppointmentModel = createGraphDBModel({
  client: {type: GDBClientModel, internalKey: ':forClient'},
  datetime: {type: Date, internalKey: ':hasDatetime'},
  person: {type: Types.NamedIndividual, internalKey: ':hasPerson'},
  user: {type: GDBUserAccountModel, internalKey: ':withUser'}
}, {
  rdfTypes: [':Appointment'], name: 'appointment'
});

module.exports = {
  GDBAppointmentModel
}