const {createGraphDBModel} = require("../utils/graphdb");
const {GDBNeedModel} = require("./need");
const {GDBServiceModel} = require("./service");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBNeedOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBNeedModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  acuity:{type: String, internalKey: ':hasAcuity'},
  serviceMatch:{type: [GDBServiceModel], internalKey: ':hasServiceMatch'},
  characteristicOccurrence: {type: GDBCOModel, internalKey: ':hasCharacteristicOccurrence'},
  serviceRegistration: {},
  serviceProvision: {},
}, {
  rdfTypes: [':NeedOccurrence'], name: 'needOccurrence'
});

module.exports = {
  GDBNeedOccurrenceModel
}