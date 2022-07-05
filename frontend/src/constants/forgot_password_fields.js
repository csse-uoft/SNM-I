import { Validator } from "../helpers";
import { defaultField } from "./index";

export const forgotPasswordFields = {

  group1: {
    email: {
      ...defaultField,
      type: 'email',
      label: 'Email',
      validator: Validator.email,
      required: true,
    }
  },

  group2: {
    securityQuestion1: {
      ...defaultField,
      label: 'Security Question',
      required: true,
    },

    securityQuestionAnswer1: {
      ...defaultField,
      label: 'Answer',
      required: true,
    },
  },

  group3: {
    securityQuestion2: {
      ...defaultField,
      label: 'Security Question',
      required: true,
    },

    securityQuestionAnswer2: {
      ...defaultField,
      label: 'Answer',
      required: true,
    },
  },

  group4: {
    securityQuestion3: {
      ...defaultField,
      label: 'Security Question',
      required: true,
    },

    securityQuestionAnswer3: {
      ...defaultField,
      label: 'Answer',
      required: true,
    }
  }

};