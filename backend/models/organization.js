const {createGraphDBModel, DeleteType} = require("../utils/graphdb");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/CharacteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");
const {MDBDynamicFormModel} = require("./dynamicForm");

const GDBOrganizationModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  characteristicOcc: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOcc: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
  // form:{type: [MDBDynamicFormModel], internalKey: 'hasForm'}

}, {
  rdfTypes: ['cp:Organization'], name: 'organization'
});

module.exports = {
  GDBOrganizationModel
}