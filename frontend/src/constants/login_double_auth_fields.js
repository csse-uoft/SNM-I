import {defaultField} from "./index";


export const loginDoubleAuthFields = {

  group1: {
    securityQuestion1: {
      ...defaultField,
      disabled: true,
      label: 'Security Question',
    },

    securityQuestionAnswer1: {
      ...defaultField,
      label: 'Answer',
      required: true,
    },
  },

  group2: {
    securityQuestion2: {
      ...defaultField,
      label: 'Security Question',
      disabled: true,
    },

    securityQuestionAnswer2: {
      ...defaultField,
      label: 'Answer',
      required: true,
    },
  },

  group3: {
    securityQuestion3: {
      ...defaultField,
      label: 'Security Question',
      disabled: true,
    },

    securityQuestionAnswer3: {
      ...defaultField,
      label: 'Answer',
      required: true,
    }
  }
}