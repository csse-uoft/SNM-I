const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBAddressModel} = require('../address')
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("../ClientFunctionalities/questionOccurrence");
const {GDBNeedSatisfierModel} = require("../needSatisfier");
const {GDBServiceProviderModel} = require("../serviceProvider");
const {GDBPersonModel} = require("../person");
const {GDBOrganizationModel} = require("../organization");
const {GDBEligibilityModel} = require('../eligibility');

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
  endDate: {type: Date, internalKey: ':hasEndDate'},
  eligibility: {type: GDBEligibilityModel, internalKey: ':hasEligibility', onDelete: DeleteType.CASCADE},

  shareability: {type: String, internalKey: ':hasShareability'},
  partnerOrganizations: {type: [GDBOrganizationModel], internalKey: ':hasPartnerOrganization'},
  idInPartnerDeployment: {type: Number, internalKey: ':hasIdInPartnerDeployment'},
}, {
  rdfTypes: [':Program'], name: 'program'
});

module.exports = {
  GDBProgramModel
}
