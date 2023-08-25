const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");

const GDBVolunteerModel = createGraphDBModel({
  firstName: {type: String, internalKey: 'foaf:givenName'},
  lastName: {type: String, internalKey: 'foaf:familyName'},
  gender: {type: Types.NamedIndividual, internalKey: 'cp:hasGender'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOccurrence: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':Volunteer'], name: 'volunteer'
});

module.exports = {
  GDBVolunteerModel
}