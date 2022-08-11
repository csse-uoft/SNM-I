const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {createQuestionHelper, updateQuestionHelper, findQuestionById} = require("./questionHelper");
const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBClientModel, GDBOrganizationModel} = require("../../models");


const createQuestion = async (req, res, next) => {
  const {content, description} = req.body;
  const data = {
    content, description
  };

  try {
    await createQuestionHelper(data);
    return res.status(202).json({success: true, message: 'Successfully update question.'});
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
    const forms = await MDBDynamicFormModel.find({formStructure: {$elemMatch: {fields: {$elemMatch: {id: id, type: 'question'}}}}})
    const clients = (await GDBClientModel.find({}, {populates: ['questionOccurrences.occurrenceOf']})).filter((client) => {
      if(client.questionOccurrences){
        for (let occurrence of client.questionOccurrences) {
          if (occurrence.occurrenceOf._id === id)
            return true
        }
      }
      return false
    })
    const organizations = (await GDBOrganizationModel.find({}, {populates: ['questionOccurrences.occurrenceOf']})).filter((organization) => {
      if(organization.questionOccurrences){
        for (let occurrence of organization.questionOccurrences) {
          if (occurrence.occurrenceOf._id === id)
            return true
        }
      }
      return false
    })
    const question = await findQuestionById(id);
    if(forms.length !== 0 || clients.length !== 0 || organizations.length !== 0 || question.isPredefined)
      res.status(400).json({success: false, message: 'This question cannot be updated'})
    await updateQuestionHelper(id, updateData);
    return res.status(202).json({success: true, message: 'Successfully update question.'});
  } catch (e) {
    next(e)
  }

}

const fetchQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const question = await findQuestionById(id);
    const forms = await MDBDynamicFormModel.find({formStructure: {$elemMatch: {fields: {$elemMatch: {id: id, type: 'question'}}}}})
    const clients = (await GDBClientModel.find({}, {populates: ['questionOccurrences.occurrenceOf']})).filter((client) => {
      if(client.questionOccurrences){
        for (let occurrence of client.questionOccurrences) {
          if (occurrence.occurrenceOf._id === id)
            return true
        }
      }
      return false
    })
    const organizations = (await GDBOrganizationModel.find({}, {populates: ['questionOccurrences.occurrenceOf']})).filter((organization) => {
      if(organization.questionOccurrences){
        for (let occurrence of organization.questionOccurrences) {
          if (occurrence.occurrenceOf._id === id)
            return true
        }
      }
      return false
    })
    return res.status(200).json({question, success: true, locked: forms.length !== 0 || clients.length !== 0 || organizations.length !== 0 || question.isPredefined});
  } catch (e) {
    next(e)
  }
}

const fetchQuestions = async (req, res, next) => {
  try {
    const rawData = await GDBQuestionModel.find({});
    const data = rawData.map((question) => {
      return {
        id : question._id,
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