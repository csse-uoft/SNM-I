const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");

const GDBAppointmentModel = createGraphDBModel({
  // client: {type: GDBClientModel, internalKey: ':client'},
  // name: {type: String, internalKey: 'tove_org:hasName'},
  // time: {type: }
  // provider: {type: Types.NamedIndividual, internalKey: ":hasServiceProvider"},
  // address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  // questionOccurrence: {type: [GDBQOModel],
  //   internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},

}, {
  rdfTypes: [':Appointment'], name: 'appointment'
});

module.exports = {
  GDBAppointmentModel
}