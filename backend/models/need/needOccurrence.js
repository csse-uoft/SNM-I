const {createGraphDBModel, getGraphDBModel} = require("../../utils/graphdb");
const {GDBNeedModel} = require("./need");
const {GDBServiceModel} = require("../service/service");
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");

const GDBNeedOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBNeedModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  acuity:{type: String, internalKey: ':hasAcuity'},
  serviceMatch:{type: [GDBServiceModel], internalKey: ':hasServiceMatch'},
  characteristicOccurrence: {type: GDBCOModel, internalKey: ':hasCharacteristicOccurrence'},
  // serviceRegistration: {type: GDBServiceRegistrationModel, internalKey: 'hasServiceRegistration'},
  // serviceProvision: {type: GDBServiceProvisionModel, internalKey: 'hasServiceProvision'},
}, {
  rdfTypes: [':NeedOccurrence'], name: 'needOccurrence'
});

module.exports = {
  GDBNeedOccurrenceModel
}