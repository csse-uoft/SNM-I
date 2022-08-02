const {createGraphDBModel, DeleteType} = require("../../utils/graphdb");
const {GDBQuestionModel} = require("./question");

const GDBQuestionOccurrenceModel = createGraphDBModel({
  dataValue: {type: String, internalKey: ':hasDataValue'},
  occurrence: {type: GDBQuestionModel, internalKey: ':occurrenceOf', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':QuestionOccurrence'], name: 'questionOccurrence'
});

module.exports = {
  GDBQuestionOccurrenceModel
}