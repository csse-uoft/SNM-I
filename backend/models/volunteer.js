const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBAddressModel} = require('./address')
const {GDBOrganizationModel} = require('./organization')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");

const GDBVolunteerModel = createGraphDBModel({
  firstName: {type: String, internalKey: 'foaf:givenName'},
  lastName: {type: String, internalKey: 'foaf:familyName'},
  gender: {type: Types.NamedIndividual, internalKey: 'cp:hasGender'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  characteristicOccurrences: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOccurrences: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
  organization: {type: GDBOrganizationModel, internalKey: ':hasOrganization'},
  shareability: {type: String, internalKey: ':hasShareability'},
  partnerOrganizations: {type: [GDBOrganizationModel], internalKey: ':hasPartnerOrganization'}
}, {
  rdfTypes: [':Volunteer'], name: 'volunteer'
});

module.exports = {
  GDBVolunteerModel
}
