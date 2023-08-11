const {createGraphDBModel, getGraphDBModel} = require("../../utils/graphdb");
const {GDBNeedModel} = require("./need");
const {GDBServiceModel} = require("../service/service");
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBClientModel} = require("../ClientFunctionalities/client");

const GDBNeedOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBNeedModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  acuity: {type: String, internalKey: ':hasAcuity'},
  serviceMatch: {type: [GDBServiceModel], internalKey: ':hasServiceMatch'},
  characteristicOccurrence: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  // serviceRegistration: {type: GDBServiceRegistrationModel, internalKey: 'hasServiceRegistration'},
  // serviceProvision: {type: GDBServiceProvisionModel, internalKey: 'hasServiceProvision'},
}, {
  rdfTypes: [':NeedOccurrence'], name: 'needOccurrence'
});

module.exports = {
  GDBNeedOccurrenceModel
}
