const {GDBQOModel} = require("../../models");
const {findQuestionById} = require("../question/questionHelper");

async function createQuestionOccHelper(id, answer) {
  const question = await findQuestionById(id);
  const questionOcc = GDBQOModel({
    stringValue: answer,
    occurrence: question,
  });

  await questionOcc.save();
  return questionOcc;
}

const createQuestionOcc = async (req, res, next) => {
  // assume we get id of the question and answer of that question in req.body
  const {id, answer} = req.body;
  
  try {
    if (!id){
      return res.status(202).json({success: true, message: 'No questionOcc need to be created.'});
    }
    await createQuestionOccHelper(id, answer);
    return res.status(202).json({success: true, message: 'Successfully create QuestionOcc.'});
  } catch (e) {
    next(e)
  }

}

module.exports = {createQuestionOcc}