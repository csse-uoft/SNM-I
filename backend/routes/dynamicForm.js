const express = require('express');

const dynamicFormService = require("../services/dynamicForm");
const router = express.Router();

// create a form
router.post('/dynamicForm', dynamicFormService.createDynamicForm);

// update a form
router.put('/dynamicForm/:id', dynamicFormService.updateDynamicForm);

// Get a form
router.get('/dynamicForm/:id', dynamicFormService.getDynamicForm);

// Delete a form
router.delete('/dynamicForm/:id', dynamicFormService.deleteDynamicForm);

// Get a set of forms by formType
router.get('/dynamicForms/:formType', dynamicFormService.getDynamicFormsByFormType);

// Get all forms
router.get('/dynamicForms', dynamicFormService.getAllDynamicForms);

router.get('/dynamicClassInstances/:class', dynamicFormService.getIndividualsInClass);

// Get the label of a URI
router.get('/label/:uri', dynamicFormService.getURILabel);


module.exports = router;