const {createGraphDBModel, DeleteType, Types} = require("../../utils/graphdb");
const {GDBQOModel} = require("./questionOccurrence");
const {GDBCOModel} = require("./characteristicOccurrence");
const {GDBNoteModel} = require("./note");
const {GDBNeedModel} = require("../need/need");
const {GDBNeedOccurrenceModel} = require("../need/needOccurrence");

/**
 * This is a Client model.
 * @type {GDBUtils.GraphDBModelConstructor}
 */
const GDBClientModel = createGraphDBModel({
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOccurrence: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
  need: {type: [GDBNeedModel], internalKey: ':hasNeed'},
  // If a need is added, need occurrence is automatically created and associated to the client.
  needOccurrence: {type: [GDBNeedOccurrenceModel], internalKey: ':hasNeedOccurrence', onDelete: DeleteType.CASCADE},
  note: {type: [String], internalKey: ':hasNote'},
  firstName: {type: String, internalKey: 'foaf:givenName'},
  lastName: {type: String, internalKey: 'foaf:familyName'},
  gender: {type: Types.NamedIndividual, internalKey: 'cp:hasGender'},
}, {
  rdfTypes: [':Client'], name: 'client'
});

module.exports = {
  GDBClientModel
}