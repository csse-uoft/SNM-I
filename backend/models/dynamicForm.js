const mongoose = require('mongoose');

const MDBDynamicFormModel = new mongoose.Model('DynamicForm', {
  // Form type could be 'client', 'service', 'provider', 'user', ...
  formType: {type: String, required: true},

  // The organization that this form is for. Org IRI
  forOrganization: {type: String},

  // UserAccount IRI
  createdBy: {type: String, required: true},

  // Plain JSON object
  formStructure: {type: Object, required: true},
});

module.exports = {
  MDBDynamicFormModel
}