import {defaultField} from "./index";
import {Validator} from "../helpers";
import RadioField from "../components/shared/fields/RadioField";


export const addEditQuestionFields = {

  label: {
    ...defaultField,
    label: 'Label',
    // validator: Validator.password,
    required: true,
  },

  dataType: {
    ...defaultField,
    label: 'Data Type',
    required: true,
    type: '', // drop down
  },

  fieldType: {
    ...defaultField,
    type:'', // dropDown
    label: 'Field Type',
    required: true,
  },

  options: {
    ...defaultField,
    type:'', // haven't decided
    label: 'Options',
    required: true,
  },

  required: {
    ...defaultField,
    type: '',
    component: RadioField,
    options: {Yes: true, No: false},
    label: 'Required?',
    required: true,
  },

  optionsFormClass: {
    ...defaultField,
    type:'dropDown',
    label: 'Class',
    required: true,
  },

  description: {
    ...defaultField,
    label: 'Description',
    required: true,
    multiline: true,
    maxRows: 50,
  },


};