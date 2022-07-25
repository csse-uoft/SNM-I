const {MDBDynamicFormModel} = require('../../models/dynamicForm');
const {GDBUserAccountModel} = require('../../models/userAccount')

async function createDynamicForm(req, res, next) {
  // TODO: implement forOrganization
  const {formType, forOrganization, formStructure} = req.body;
  const modifiedAt = new Date();

  // Get current user IRI
  const currentUser = await GDBUserAccountModel.findOne({primaryEmail: req.session.email});
  const createdBy = currentUser.individualName;

  const form = MDBDynamicFormModel({
    formType, formStructure, createdBy, modifiedAt
  });

  await form.save();
  res.json({success: true});
}

async function updateDynamicForm(req, res, next) {
  const {formType, formStructure} = req.body;
  const {id} = req.params;

  const form = await MDBDynamicFormModel.findById(id);
  form.formType = formType;
  form.formStructure = formStructure;
  form.modifiedAt = new Date();

  await form.save();
  res.json({success: true});
}

async function deleteDynamicForm(req, res, next) {
  const {id} = req.params;
  await MDBDynamicFormModel.deleteOne({_id: id});
  res.json({success: true});
}

async function getDynamicForm(req, res, next) {
  const {id} = req.params;
  const form = await MDBDynamicFormModel.findById(id);
  res.json({
    success: true,
    form
  });
}

async function getAllDynamicForms(req, res, next) {
  const forms = await MDBDynamicFormModel.find({}, 'formType forOrganization createdBy modifiedAt');
  res.json({
    success: true,
    forms
  });
}

async function getDynamicFormsByFormType(req, res, next) {
  const forms = await MDBDynamicFormModel.find({formType: req.params.formType}, 'forOrganization createdBy modifiedAt');
  res.json({
    success: true,
    forms
  });
}


module.exports = {
  createDynamicForm, getAllDynamicForms, getDynamicForm, deleteDynamicForm, updateDynamicForm, getDynamicFormsByFormType
}