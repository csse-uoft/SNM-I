import { defaultOperationHour, operationHourListToObject } from "../helpers/operation_hour_helpers";
import { recursiveAssign } from "../helpers";
import { providerFormTypes } from "./provider_fields";

export const defaultProfileFields = {
  givenName: '',
  middleName: '',
  familyName: '',
  preferredName: '',
  gender: '',
  birthDate: null,
  email: '',
  altEmail:'',
  telephone: '',
};

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

let classOrManually;
export const defaultAddEditQuestionFields = {
  name:'',
  label: '', // Ex. address
  codes: [],
  dataType: '', // Ex. string
  fieldType: '', // Ex. address
  // options: [{key: 0, label: ''}], // Ex.
  optionsFromClass: '', // Ex. provider
  description: '', // Ex. the address of the user's home
  classOrManually: 'class'
}

export const defaultAddEditNeedFields = {
  type: '',
  changeType: '',
  needSatisfier : '',
  characteristic: '',
  code: []
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

export const defaultContactFields = {
  givenName: '',
  familyName: '',
  email: '',
  altEmail:'',
  telephone: '',
};

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

// export const defaultResetPassword = {
//   new_password: '',
//   repeat_password: ''
// };

/**
 * @typedef SNMClient {{address: {street_address, province, city, apt_number, postal_code},
 * num_of_dependants: string, has_children: boolean, immigration_doc_number: string,
 * country_of_last_residence: string, profile: {primary_phone_number, gender,
 * alt_phone_number, birth_date, last_name, middle_name, first_name, preferred_name,
 * email}, other_languages: Array, income_source: string, country_of_origin: string,
 * completed_education_level: string, landing_date: string, marital_status: string,
 * eligibilities: Array, current_education_level: string, first_language: string,
 * file_id: string, num_of_children: string, pr_number: string, family: {members: Array},
 * arrival_date: string, status_in_canada: string}}
 *
 */

/**
 *
 * @param client
 * @returns SNMClient
 */
export const generateClientField = (client) => {
  const fields = {
    profile: {...defaultProfileFields},
    address: {...defaultLocationFields},
    family: {members: []},
    marital_status: '',
    has_children: false,
    num_of_children: '',
    country_of_origin: '',
    country_of_last_residence: '',
    first_language: '',
    other_languages: [],
    pr_number: '',
    immigration_doc_number: '',
    landing_date: null, // make sure date and time has default null or new Date()
    arrival_date: null,
    status_in_canada: '',
    income_source: '',
    current_education_level: '',
    completed_education_level: '',
    num_of_dependants: '',
    file_id: '',
    ngo_conditions: [],
  };

  if (client) {
    return recursiveAssign(fields, client);
  }

  return fields;
};

export const generateProviderFields = (providerType, providerCategory, provider) => {
  // operationHourListToObject(provider.operation_hours)
  const fields = {
    type: providerType,
    category: providerFormTypes[providerCategory] || '',
    languages: [],
    company: '',
    email: '',
    primary_phone_number: '',
    alt_phone_number: '',
    primary_contact: {profile: {...defaultContactFields}},
    secondary_contact: {profile: {...defaultContactFields}},
    main_address: {...defaultLocationFields},
    other_addresses: [],
    operation_hours: {...defaultOperationHour},
    operation_dates: [{start_date: null, end_date: null}],
    profile: {...defaultProfileFields},
    referrer: '',
    own_car: false,
    skills: '',
    visibility: false,
    status: '',
    notes: '',
    commitment: '',
    start_date: '',
    reference1_name: '',
    reference1_phone: '',
    reference1_email: '',
    reference2_name: '',
    reference2_phone: '',
    reference2_email: '',
    responses: []
  };
  if (provider) {
    const data = {...recursiveAssign(fields, provider)};
    data.operation_hours = {...defaultOperationHour, ...operationHourListToObject(provider.operation_hours)};
    // const responses = {};
    // data.responses.forEach(({}) => {});
    // data.responses = data
    console.log(data);
    return data;
  }
  return fields;
};

const generateServiceFields = (service) => {

}