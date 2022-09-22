const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBServiceProviderModel} = require("./serviceProvider");

const GDBServiceModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  serviceProvider: {type: GDBServiceProviderModel, internalKey: ':hasServiceProvider'},
  eligibilityCondition: {type: String, internalKey: ':hasEligibilityCondition'},
  address: {type: GDBAddressModel, internalKey: ':hasLocation'},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'}
  // questionOccurrence: {type: [GDBQOModel],
  //   internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},

}, {
  rdfTypes: [':Service'], name: 'service'
});

module.exports = {
  GDBServiceModel
}