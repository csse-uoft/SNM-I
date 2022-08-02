const {createGraphDBModel, DeleteType, Types} = require("../../utils/graphdb");
const {GDBQuestionModel} = require("./question");

const GDBQuestionOccurrenceModel = createGraphDBModel({
  dataValue: {type: Types.NamedIndividual, internalKey: ':hasDataValue'},
  occurrence: {type: GDBQuestionModel, internalKey: ':occurrenceOf', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':QuestionOccurrence'], name: 'questionOccurrence'
});

module.exports = {
  GDBQuestionOccurrenceModel
}