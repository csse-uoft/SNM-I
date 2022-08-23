const mongoose = require('mongoose');

const MDBDynamicFormModel = mongoose.model('DynamicForm', new mongoose.Schema({
  name: {type: String, required: true},

  // Form type could be 'client', 'service', 'provider', 'user', ...
  formType: {type: String, required: true},

  // The organization that this form is for. Org IRI
  // TODO
  forOrganization: {type: String},

  // UserAccount IRI
  createdBy: {type: String, required: true},

  // Plain JSON object
  formStructure: {type: Object, required: true},

  modifiedAt: {type: Date}
}));

module.exports = {
  MDBDynamicFormModel
}