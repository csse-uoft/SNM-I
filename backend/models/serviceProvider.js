const {createGraphDBModel, DeleteType} = require("graphdb-utils");
const {GDBOrganizationModel} = require("./organization");
const {GDBVolunteerModel} = require("./volunteer");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBServiceProviderModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  organization: {type: GDBOrganizationModel, internalKey: ':hasOrganization'},
  volunteer: {type: GDBVolunteerModel, internalKey: ':hasVolunteer'},
  characteristicOccurrences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':ServiceProvider'], name: 'serviceProvider'
});

module.exports = {
  GDBServiceProviderModel
}