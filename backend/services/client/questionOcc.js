const {GDBQOModel} = require("../../models");
const {findQuestionById} = require("../question/questionHelper");

async function createQuestionOccurrence(id, answer) {
  const question = await findQuestionById(id);
  const questionOcc = GDBQOModel({
    stringValue: answer,
    occurrenceOf: question,
  });

  await questionOcc.save();
  return questionOcc;
}

module.exports = {createQuestionOccurrence}