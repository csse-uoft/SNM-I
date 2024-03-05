const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBQOModel} = require("./questionOccurrence");
const {GDBCOModel} = require("./characteristicOccurrence");
const {GDBNoteModel} = require("./note");
const {GDBNeedModel} = require("../need/need");
const {GDBNeedOccurrenceModel} = require("../need/needOccurrence");
const {GDBOutcomeModel} = require("../outcome/outcome");
const {GDBOutcomeOccurrenceModel} = require("../outcome/outcomeOccurrence");
const {GDBAddressModel} = require('../address');

/**
 * This is a Client model.
 */
const GDBClientModel = createGraphDBModel({
  characteristicOccurrences: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOccurrences: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
  needs: {type: [GDBNeedModel], internalKey: ':hasNeed'},
  // If a need is added, need occurrence is automatically created and associated to the client.
  needOccurrences: {type: [GDBNeedOccurrenceModel], internalKey: ':hasNeedOccurrence', onDelete: DeleteType.CASCADE},
  outcomes: {type: [GDBOutcomeModel], internalKey: ':hasOutcome'},
  // If an outcome is added, outcome occurrence is automatically created and associated to the client.
  outcomeOccurrences: {type: [GDBOutcomeOccurrenceModel], internalKey: ':hasOutcomeOccurrence', onDelete: DeleteType.CASCADE},
  notes: {type: [String], internalKey: ':hasNote'},
  firstName: {type: String, internalKey: 'foaf:givenName'},
  lastName: {type: String, internalKey: 'foaf:familyName'},
  gender: {type: Types.NamedIndividual, internalKey: 'cp:hasGender'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':Client'], name: 'client'
});

module.exports = {
  GDBClientModel
}
