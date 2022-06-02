const {createGraphDBModel} = require("../utils/graphdb");
const {GDBAddressModel} = require('./address')

const GDBOrganizationModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'}

}, {
  rdfTypes: ['cp:Organization'], name: 'organization'
});

module.exports = {
  GDBOrganizationModel
}