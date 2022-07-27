const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {createQuestionHelper, updateQuestionHelper, findQuestionById} = require("./questionHelper");


const createQuestion = async (req, res, next) => {
  const {content, description} = req.body;
  const data = {
    content, description
  };

  try {
    await createQuestionHelper(data);
    return res.status(202).json({success: true, message: 'Successfully update Characteristic.'});
  } catch (e) {
    next(e)
  }

}

const updateQuestion = async (req, res, next) => {
  const id = req.params.id;
  const {content, description} = req.body;
  const updateData = {
    content, description
  };

  try {
    await updateQuestionHelper(id, updateData);
    return res.status(202).json({success: true, message: 'Successfully update Characteristic.'});
  } catch (e) {
    next(e)
  }

}

const fetchQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const question = await findQuestionById(id);
    return res.status(200).json({question, success: true});
  } catch (e) {
    next(e)
  }
}

const fetchQuestions = async (req, res, next) => {
  try {
    const rawData = await GDBQuestionModel.find({});
    const data = rawData.map((question) => {
      return {
        content : question.content,
        description: question.description,
      }
    })
    return res.status(200).json({data, success: true});
  } catch (e) {
    next(e)
  }
}

const deleteQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await GDBQuestionModel.findByIdAndDelete(id);
    return res.status(200).json({success: true});
  } catch (e) {
    next(e)
  }
}


module.exports = {
  createQuestion, updateQuestion, fetchQuestion,
  fetchQuestions, deleteQuestion
}