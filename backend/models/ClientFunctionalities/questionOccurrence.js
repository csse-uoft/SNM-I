const {createGraphDBModel, DeleteType} = require("../../utils/graphdb");
const {GDBQuestionModel} = require("./question");

/**
 * GDBQOModel stands for GDB - Question Occurrence - Model
 * @type {GDBUtils.GraphDBModelConstructor}
 */
const GDBQOModel = createGraphDBModel({
  stringValue: {type: String, internalKey: ':hasStringValue'},
  occurrenceOf: {type: GDBQuestionModel, internalKey: ':occurrenceOf', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':QuestionOccurrence'], name: 'questionOccurrence'
});

module.exports = {
  GDBQOModel
}