const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBAddressModel} = require('../address')
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBServiceProviderModel} = require("../serviceProvider");
const {GDBNeedSatisfierModel} = require("../needSatisfier");
const {GDBProgramModel} = require("../program/program");
const {GDBOrganizationModel} = require("../organization");
const {GDBEligibilityModel} = require('../eligibility');

const GDBServiceModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristicOccurrences: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  serviceProvider: {type: GDBServiceProviderModel, internalKey: ':hasServiceProvider'},
  eligibilityCondition: {type: String, internalKey: ':hasEligibilityCondition'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'},
  needSatisfiers: {type: [GDBNeedSatisfierModel], internalKey: ':hasNeedSatisfier'},
  program: {type: GDBProgramModel, internalKey: ':hasProgram'},
  eligibility: {type: GDBEligibilityModel, internalKey: ':hasEligibility', onDelete: DeleteType.CASCADE},

  shareability: {type: String, internalKey: ':hasShareability'},
  partnerOrganizations: {type: [GDBOrganizationModel], internalKey: ':hasPartnerOrganization'},
  idInPartnerDeployment: {type: String, internalKey: ':hasIdInPartnerDeployment'},
}, {
  rdfTypes: [':Service'], name: 'service'
});

module.exports = {
  GDBServiceModel
}
