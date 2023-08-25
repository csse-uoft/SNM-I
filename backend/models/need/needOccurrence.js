const {createGraphDBModel, getGraphDBModel} = require("graphdb-utils");
const {GDBNeedModel} = require("./need");
const {GDBServiceModel} = require("../service/service");
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");

const GDBNeedOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBNeedModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  acuity: {type: String, internalKey: ':hasAcuity'},
  serviceMatches: {type: [GDBServiceModel], internalKey: ':hasServiceMatch'},
  characteristicOccurrences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  client: {type: () => require("../ClientFunctionalities/client").GDBClientModel, internalKey: ':hasClient'},
  // serviceRegistration: {type: GDBServiceRegistrationModel, internalKey: 'hasServiceRegistration'},
  // serviceProvision: {type: GDBServiceProvisionModel, internalKey: 'hasServiceProvision'},
}, {
  rdfTypes: [':NeedOccurrence'], name: 'needOccurrence'
});

module.exports = {
  GDBNeedOccurrenceModel
}
