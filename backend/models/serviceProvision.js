const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");
const {GDBServiceOccurrenceModel} = require("./service/serviceOccurrence");
const {GDBNeedSatisfierOccurrenceModel} = require("./needSatisfierOccurrence");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");

const GDBServiceProvisionModel = createGraphDBModel({
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':forNeedOccurrence'},
  serviceOccurrence: {type: GDBServiceOccurrenceModel, internalKey: ':hasServiceOccurrence'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  needSatisfierOccurrence: {type: GDBNeedSatisfierOccurrenceModel, internalKey: ':hasNeedSatisfierOccurrence'},
  characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  client: {type: GDBClientModel, internalKey: ':hasClient'}
}, {
  rdfTypes: [':ServiceProvision'], name: 'serviceProvision'
});

module.exports = {
  GDBServiceProvisionModel
}