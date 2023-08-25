const {createGraphDBModel} = require("graphdb-utils");

/**
 * This is the Question Model
 */
const GDBQuestionModel = createGraphDBModel({
  description: {type: String, internalKey: 'cids:hasDescription'},
  content: {type: String, internalKey: ':hasContent'},
}, {
  rdfTypes: [':Question'], name: 'question'
});

module.exports = {
  GDBQuestionModel
}