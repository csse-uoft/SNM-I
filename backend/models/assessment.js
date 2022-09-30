const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBOrganizationModel} = require("./organization");
const {GDBNeedOccurrenceModel} = require("./needOccurrence");

const GDBAssessmentModel = createGraphDBModel({
  client: {type: GDBClientModel, internalKey: ':forClient'},
  datetime: {type: Date, internalKey: ':hasDatetime'},
  person: {type: Types.NamedIndividual, internalKey: ':byPerson'},
  organization: {type: GDBOrganizationModel, internalKey: ':byOrganization'},
  user: {type: GDBUserAccountModel, internalKey: ':byUser'},
  needOccurrence: {type: [GDBNeedOccurrenceModel], internalKey: ':hasNeedOccurrences'},
  description: {type: String, internalKey: ':hasDescription'}
}, {
  rdfTypes: [':Assessment'], name: 'assessment'
});

module.exports = {
  GDBAssessmentModel
}