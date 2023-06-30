const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");
const {GDBNeedSatisfierOccurrenceModel} = require("./needSatisfierOccurrence");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");

const GDBProgramProvisionModel = createGraphDBModel({
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':forNeedOccurrence'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  needSatisfierOccurrence: {type: GDBNeedSatisfierOccurrenceModel, internalKey: ':hasNeedSatisfierOccurrence'},
  characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  client: {type: GDBClientModel, internalKey: ':hasClient'}
}, {
  rdfTypes: [':ProgramProvision'], name: 'programProvision'
});

module.exports = {
  GDBProgramProvisionModel
}
