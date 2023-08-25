const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBOrganizationModel} = require("./organization");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");
const {GDBPersonModel} = require("./person");
const {GDBNoteModel} = require("./ClientFunctionalities/note");
const {GDBOutcomeOccurrenceModel} = require("./outcomeOccurrence");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBAssessmentModel = createGraphDBModel({
  client: {type: GDBClientModel, internalKey: ':forClient'},
  datetime: {type: Date, internalKey: ':hasDatetime'},
  person: {type: GDBPersonModel, internalKey: ':byPerson'},
  organization: {type: GDBOrganizationModel, internalKey: ':byOrganization'},
  user: {type: GDBUserAccountModel, internalKey: ':byUser'},
  needOccurrence: {type: [GDBNeedOccurrenceModel], internalKey: ':hasNeedOccurrences'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  note: {type: GDBNoteModel, internalKey: ':Note'},
  outcomeOccurrence: {type: [GDBOutcomeOccurrenceModel], internalKey: ':hasOutcomeOccurrences'},
  // characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':Assessment'], name: 'assessment'
});

module.exports = {
  GDBAssessmentModel
}
