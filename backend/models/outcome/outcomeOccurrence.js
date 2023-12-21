const {createGraphDBModel, getGraphDBModel} = require("graphdb-utils");
const {GDBOutcomeModel} = require("./outcome");
const {GDBServiceModel} = require("../service/service");
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBAddressModel} = require('../address');

const GDBOutcomeOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBOutcomeModel, internalKey: ':occurrenceOf'},
  client: {type: () => require("../ClientFunctionalities/client").GDBClientModel, internalKey: ':hasClient'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  serviceMatches: {type: [GDBServiceModel], internalKey: ':hasServiceMatch'},
  characteristicOccurrences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
}, {
  rdfTypes: [':OutcomeOccurrence'], name: 'outcomeOccurrence'
});

module.exports = {
  GDBOutcomeOccurrenceModel
}
