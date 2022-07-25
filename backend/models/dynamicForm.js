const mongoose = require('mongoose');

const exampleFormStructure = [
  {
    stepName: "Step 1",
    form: {
      "snmi:char_company": {type: "characteristic", required: false},
      "snmi:char_name": {type: "characteristic", required: false}
    }
  },
  {
    stepName: "Step 2",
    form: {}
  }
]

const MDBDynamicFormModel = mongoose.model('DynamicForm', new mongoose.Schema({
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