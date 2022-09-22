const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBServiceProviderModel} = require("./serviceProvider");
const {createGraphDBModel, Types, DeleteType} = require("../utils/graphdb");
const {GDBNeedModel} = require("./need");
const {GDBServiceModel} = require("./service");

const GDBServiceOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBServiceModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'}, // todo
  hoursOfOperation: {type: Number, internalKey: ':hasHoursOfOperation'},
  address: {type: GDBAddressModel, internalKey: ':hasLocation'},

  // questionOccurrence: {type: [GDBQOModel],
  //   internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},

}, {
  rdfTypes: [':Service'], name: 'service'
});

module.exports = {
  GDBServiceOccurrenceModel
}