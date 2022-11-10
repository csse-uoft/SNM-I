const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");
const {GDBServiceOccurrenceModel} = require("./service/serviceOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBNeedSatisfierOccurrenceModel} = require("./needSatisfierOccurrence");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBServiceProvisionModel = createGraphDBModel({
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':forNeedOccurrence'},
  serviceOccurrence: {type: GDBServiceOccurrenceModel, internalKey: ':hasServiceOccurrence'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  needSatisfierOccurrence: {type: GDBNeedSatisfierOccurrenceModel, internalKey: ':hasNeedSatisfierOccurrence'},
  characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':ServiceProvision'], name: 'serviceProvision'
});

module.exports = {
  GDBServiceProvisionModel
}