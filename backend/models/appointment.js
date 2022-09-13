const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");

const GDBAppointmentModel = createGraphDBModel({
  name: {type: String, internalKey: ':hasName'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  createdBy: {type: GDBUserAccountModel, internalKey: ':createdBy'},
  datetime: {type: Date, internalKey: ':hasDatetime'},
  person: {type: Types.NamedIndividual, internalKey: ':hasPerson'},
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':Appointment'], name: 'appointment'
});

module.exports = {
  GDBAppointmentModel
}