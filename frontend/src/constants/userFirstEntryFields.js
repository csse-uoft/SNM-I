import { Validator } from "../helpers";
import { defaultField } from "./index";

export const userFirstEntryFields = {

  password: {
    ...defaultField,
    label: 'Password',
    validator: Validator.password,
    required: true,
  },

  confirmPassword: {
    ...defaultField,
    label: 'Confirm you password',
    required: true,
  },

  securityQuestion1: {
    ...defaultField,
    label: 'Security Question 1',
    required: true,
  },

  securityQuestionAnswer1: {
    ...defaultField,
    label: 'Answer',
    required: true,
  },

  securityQuestion2: {
    ...defaultField,
    label: 'Security Question 2',
    required: true,
  },

  securityQuestionAnswer2: {
    ...defaultField,
    label: 'Answer',
    required: true,
  },

  securityQuestion3: {
    ...defaultField,
    label: 'Security Question 3',
    required: true,
  },

  securityQuestionAnswer3: {
    ...defaultField,
    label: 'Answer',
    required: true,
  }


};