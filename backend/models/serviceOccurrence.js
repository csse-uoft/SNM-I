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
  mode: {type: {}, internalKey: ':hasMode'}, // todo
  hoursOfOperation: {type: Number, internalKey: ':hasHoursOfOperation'},
  address: {type: GDBAddressModel, internalKey: ':hasLocation'},


  name: {type: String, internalKey: 'tove_org:hasName'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  serviceProvider: {type: GDBServiceProviderModel, internalKey: ':hasServiceProvider'},
  eligibilityCondition: {type: String, internalKey: ':hasEligibilityCondition'},
  address: {type: GDBAddressModel, internalKey: ':hasLocation'},
  mode: {type: {}, internalKey: ':hasMode'} // todo
  // questionOccurrence: {type: [GDBQOModel],
  //   internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},

}, {
  rdfTypes: [':Service'], name: 'service'
});

module.exports = {
  GDBServiceOccurrenceModel
}