const {createGraphDBModel, DeleteType} = require("../../utils/graphdb");
const {GDBQOModel} = require("./questionOccurrence");
const {GDBCOModel} = require("./characteristicOccurrence");
const {GDBNoteModel} = require("./note");


const GDBClientModel = createGraphDBModel({
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOccurrence: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
  note: {type: [GDBNoteModel], internalKey: 'hasNote'}
}, {
  rdfTypes: [':Client'], name: 'client'
});

module.exports = {
  GDBClientModel
}