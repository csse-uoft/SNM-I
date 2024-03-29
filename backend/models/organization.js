const {createGraphDBModel, DeleteType} = require("graphdb-utils");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");

const GDBOrganizationModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
  description: {type: String, internalKey: 'cids:hasDescription'},
  characteristicOccurrences: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOccurrences: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},

  status: {type: String, internalKey: ':hasStatus'},
  endpointUrl: {type: String, internalKey: ':hasEndpointUrl'},
  endpointPort: {type: Number, internalKey: ':hasEndpointNumber'},
  apiKey: {type: String, internalKey: ':hasApiKey'},
}, {
  rdfTypes: [':Organization'], name: 'organization'
});

module.exports = {
  GDBOrganizationModel
}
