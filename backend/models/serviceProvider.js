const {createGraphDBModel, DeleteType} = require("../utils/graphdb");
const {GDBOrganizationModel} = require("./organization");
const {GDBVolunteerModel} = require("./Volunteer");

const GDBServiceProviderModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  organization: {type: GDBOrganizationModel, internalKey: ':hasOrganization'},
  volunteer: {type: GDBVolunteerModel, internalKey: ':hasVolunteer'}

}, {
  rdfTypes: [':ServiceProvider'], name: 'serviceProvider'
});

module.exports = {
  GDBServiceProviderModel
}