const {createGraphDBModel, DeleteType} = require("../utils/graphdb");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/CharacteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");
const {MDBDynamicFormModel} = require("./dynamicForm");

const GDBOrganizationModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOccurrence: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},

}, {
  rdfTypes: ['cp:Organization'], name: 'organization'
});

module.exports = {
  GDBOrganizationModel
}