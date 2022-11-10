const {createGraphDBModel, DeleteType} = require("../utils/graphdb");
const {GDBOrganizationModel} = require("./organization");
const {GDBVolunteerModel} = require("./volunteer");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBServiceProviderModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  organization: {type: GDBOrganizationModel, internalKey: ':hasOrganization'},
  volunteer: {type: GDBVolunteerModel, internalKey: ':hasVolunteer'},
  characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':ServiceProvider'], name: 'serviceProvider'
});

module.exports = {
  GDBServiceProviderModel
}