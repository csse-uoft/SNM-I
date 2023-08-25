const {createGraphDBModel, DeleteType} = require("graphdb-utils");
const {GDBQuestionModel} = require("./question");

/**
 * GDBQOModel stands for GDB - Question Occurrence - Model
 */
const GDBQOModel = createGraphDBModel({
  stringValue: {type: String, internalKey: ':hasStringValue'},
  occurrenceOf: {type: GDBQuestionModel, internalKey: ':occurrenceOf'},
}, {
  rdfTypes: [':QuestionOccurrence'], name: 'questionOccurrence'
});

module.exports = {
  GDBQOModel
}