const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBNeedOccurrenceModel} = require("./needOccurrence");
const {GDBServiceOccurrenceModel} = require("./serviceOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBNeedSatisfierOccurrenceModel} = require("./needSatisfierOccurrence");

const GDBServiceProvisionModel = createGraphDBModel({
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':forNeedOccurrence'},
  serviceOccurrence: {type: GDBServiceOccurrenceModel, internalKey: ':hasServiceOccurrence'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  needSatisfierOccurrence: {type: GDBNeedSatisfierOccurrenceModel, internalKey: ':hasNeedSatisfierOccurrence'},
}, {
  rdfTypes: [':ServiceProvision'], name: 'serviceProvision'
});

module.exports = {
  GDBServiceProvisionModel
}