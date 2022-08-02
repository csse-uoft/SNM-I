const {GDBQOModel} = require("../../models");
const {findQuestionById} = require("../question/questionHelper");

async function createQuestionOccHelper(id) {
  const question = await findQuestionById(id);
  const questionOcc = GDBQOModel({
    stringValue: question.content,
    occurrence: question,
  });

  await questionOcc.save();
  return questionOcc;
}

const createQuestionOcc = async (req, res, next) => {
  // assume we get id of the question in req.body
  const {id} = req.body;

  try {
    if (data === []){
      return res.status(202).json({success: true, message: 'No questionOcc need to be created.'});
    }
    await createQuestionOccHelper(id);
    return res.status(202).json({success: true, message: 'Successfully create QuestionOcc.'});
  } catch (e) {
    next(e)
  }

}

module.exports = {createQuestionOcc}