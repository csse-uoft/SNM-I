const {createGraphDBModel, DeleteType, Types} = require("../../utils/graphdb");
const {GDBAddressModel} = require('../address')
const {GDBCOModel} = require("../ClientFunctionalities/characteristicOccurrence");
const {GDBServiceProviderModel} = require("../serviceProvider");
const {GDBNeedSatisfierModel} = require("../needSatisfier");
const {GDBProgramModel} = require("../program");

const GDBServiceModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  serviceProvider: {type: GDBServiceProviderModel, internalKey: ':hasServiceProvider'},
  eligibilityCondition: {type: String, internalKey: ':hasEligibilityCondition'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'},
  needSatisfier: {type: [GDBNeedSatisfierModel], internalKey: ':hasNeedSatisfier'},
  program: {type: GDBProgramModel, internalKey: ':hasProgram'}
}, {
  rdfTypes: [':Service'], name: 'service'
});

module.exports = {
  GDBServiceModel
}