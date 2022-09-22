const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");

const GDBServiceModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  // address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  // questionOccurrence: {type: [GDBQOModel],
  //   internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},

}, {
  rdfTypes: [':Service'], name: 'service'
});

module.exports = {
  GDBServiceModel
}