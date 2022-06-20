import { defaultOperationHour, operationHourListToObject } from "../helpers/operation_hour_helpers";
import { recursiveAssign } from "../helpers";
import { providerFormTypes } from "./provider_fields";

export const defaultProfileFields = {
  first_name: '',
  middle_name: '',
  last_name: '',
  preferred_name: '',
  gender: '',
  birth_date: null,
  email: '',
  primary_phone_number: '',
  alt_phone_number: '',
};

export const defaultContactFields = {
  first_name: '',
  last_name: '',
  email: '',
  primary_phone_number: '',
  alt_phone_number: '',
};

export const defaultLocationFields = {
  street_address: '',
  apt_number: '',
  city: '',
  province: '',
  postal_code: ''
};

export const defaultUserFields = {
  first_name: '',
  last_name: '',
  email: '',
  is_superuser: false,
  primary_phone_number: '',
  alt_phone_number: ''
};

export const defaultResetPassword = {
  new_password: '',
  repeat_password: ''
};

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
