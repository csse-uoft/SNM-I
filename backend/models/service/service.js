const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBAddressModel} = require('../address')
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBServiceProviderModel} = require("../serviceProvider");
const {GDBNeedSatisfierModel} = require("../needSatisfier");
const {GDBProgramModel} = require("../program/program");

const GDBServiceModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristicOccurrences: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  serviceProvider: {type: GDBServiceProviderModel, internalKey: ':hasServiceProvider'},
  eligibilityCondition: {type: String, internalKey: ':hasEligibilityCondition'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'},
  needSatisfiers: {type: [GDBNeedSatisfierModel], internalKey: ':hasNeedSatisfier'},
  program: {type: GDBProgramModel, internalKey: ':hasProgram'},
  eligibility: {type: () => require('../eligibility').GDBEligibilityModel,
    internalKey: ':hasEligibility', onDelete: DeleteType.CASCADE}
}, {
  rdfTypes: [':Service'], name: 'service'
});

module.exports = {
  GDBServiceModel
}
