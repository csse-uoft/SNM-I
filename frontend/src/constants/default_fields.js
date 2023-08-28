import { defaultOperationHour, operationHourListToObject } from "../helpers/operation_hour_helpers";
import { recursiveAssign } from "../helpers";
import { providerFormTypes } from "./provider_fields";

export const defaultFirstEntryFields = {
  password: '',
  confirmPassword: '',
  securityQuestion1: '',
  securityQuestionAnswer1: '',
  securityQuestion2: '',
  securityQuestionAnswer2: '',
  securityQuestion3: '',
  securityQuestionAnswer3: '',
}

export const defaultAddEditQuestionFields = {
  name:'',
  label: '', // Ex. address
  codes: [],
  dataType: null, // Ex. string
  fieldType: null, // Ex. address
  // options: [{key: 0, label: ''}], // Ex.
  optionsFromClass: null, // Ex. provider
  description: '', // Ex. the address of the user's home
  classOrManually: 'class'
}

export const defaultAddEditNeedFields = {
  type: '',
  changeType: '',
  description: '',
  needSatisfiers : [],
  characteristic: '',
  codes: []
}

export const defaultAddEditOutcomeFields = {
  type: '',
  changeType: '',
  description: '',
  characteristic: '',
  codes: []
}

export const defaultInvitationFields = {
  isSuperuser: false,
  email: '',
  expirationDate: ''
}

export const defaultCurrentPasswordFields = {
  currentPassword: '',
}

export const defaultNewPasswordFields = {
  newPassword:'',
  repeatNewPassword:'',
}

export const defaultForgotPasswordFields = {
  group1: {email: ''},
  group2: {securityQuestion1: '', securityQuestionAnswer1: ''},
  group3: {securityQuestion2: '', securityQuestionAnswer2: ''},
  group4: {securityQuestion3: '', securityQuestionAnswer3: ''},
}

export const defaultSecurityQuestionsFields = {
  group1: {securityQuestion1: '', securityQuestionAnswer1: ''},
  group2: {securityQuestion2: '', securityQuestionAnswer2: ''},
  group3: {securityQuestion3: '', securityQuestionAnswer3: ''},
}

export const defaultLocationFields = {
  streetAddress: '',
  aptNumber: '',
  city: '',
  province: '',
  postalCode: ''
};

export const defaultUserFields = {
  givenName: '',
  familyName: '',
  email: '',
  altEmail:'',
  isSuperuser: false,
  telephone: '',
  newPassword: '',
  repeatPassword: ''
};

