const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBAddressModel} = require('../address')
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("../ClientFunctionalities/questionOccurrence");
const {GDBNeedSatisfierModel} = require("../needSatisfier");
const {GDBServiceProviderModel} = require("../serviceProvider");
const {GDBPersonModel} = require("../person");

const GDBProgramModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristicOccurrences: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  serviceProvider: {type: GDBServiceProviderModel, internalKey: ':hasServiceProvider'},
  manager: {type: GDBPersonModel, internalKey: ':hasManager'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'},
  needSatisfiers: {type: [GDBNeedSatisfierModel], internalKey: ':hasNeedSatisfier'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'}
}, {
  rdfTypes: [':Program'], name: 'program'
});

module.exports = {
  GDBProgramModel
}
