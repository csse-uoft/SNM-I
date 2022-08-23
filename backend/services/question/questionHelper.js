const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");

async function findQuestionById(id) {
  return await GDBQuestionModel.findOne({_id: id});
}

async function createQuestionHelper (data) {
  const {content, description} = data;
  const question = GDBQuestionModel({
    content,
    description,
  });
  await question.save();
  return question;
}

async function updateQuestionHelper(id, updateData) {
  const question = await findQuestionById(id);
  const {content, description} = updateData;

  if(content){
    question.content = content;
  }

  if(description){
    question.description = description;
  }

  await question.save();
  return question;

}

module.exports = {
  createQuestionHelper, updateQuestionHelper, findQuestionById
}