const {createGraphDBModel} = require("../../utils/graphdb");

/**
 * This is the Question Model
 * @type {GDBUtils.GraphDBModelConstructor}
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