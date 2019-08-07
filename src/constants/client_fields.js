import { maritalStatusOptions, statusInCanadaOptions, educationLevelOptions, genderOptions,
         incomeSourceOptions } from '../store/defaults.js';

import { profileFields } from './shared_fields.js'


export const clientFields = {
  address: { label: 'Address' },
  alt_phone_number: { component: 'GeneralField', type: 'tel', label: 'Alternative Phone Number' },
  arrival_date: { component: 'GeneralField', type: 'date', label: 'Arrival Date (if different from landing_date)' },
  birth_date: { component: 'GeneralField', type: 'date', label: 'Date of Birth' },
  completed_education_level: { component: 'SelectField', label: 'Completed Education Level', options: educationLevelOptions },
  country_of_last_residence: { component: 'GeneralField', type: 'text', label: 'Country of Last Residence' },
  country_of_origin: { component: 'GeneralField', type: 'text', label: 'Country of Origin' },
  current_education_level: { component: 'SelectField', label: 'Current Education Level', options: educationLevelOptions },
  eligibilities: { component: 'CheckboxField', label: 'Eligibilities' },
  email: { component: 'GeneralField', type: 'email', label: 'Email' },
  family: { label: 'Family' },
  file_id: { component: 'GeneralField', type: 'text', label: 'File ID' },
  first_language: { component: 'SelectField', label: 'First Language' },
  first_name: { component: 'GeneralField', type: 'text', label: 'First Name' },
  gender: { component: 'SelectField', label: 'Gender', options: genderOptions },
  has_children: { component: 'RadioField', label: 'Do you have children?', options: { 'Yes': true, 'No': false } },
  immigration_doc_number: { component: 'GeneralField', type: 'text', label: 'Immigration Document Number (if different from PR card)' },
  income_source: { component: 'SelectField', label: 'Income Source', options: incomeSourceOptions },
  landing_date: { component: 'GeneralField', type: 'date', label: 'Landing Date' },
  last_name: { component: 'GeneralField', type: 'text', label: 'Last Name' },
  marital_status: { component: 'SelectField', label: 'Marital Status', options: maritalStatusOptions },
  middle_name: { component: 'GeneralField', type: 'text', label: 'Middle Name' },
  num_of_children: { component: 'GeneralField', type: 'number', label: 'Number of Children' },
  num_of_dependants: { component: 'GeneralField', type: 'number', label: 'Number of Dependants' },
  other_languages: { component: 'MultiSelectField', label: 'Other languages' },
  preferred_name: { component: 'GeneralField', type: 'text', label: 'Preferred Name' },
  primary_phone_number: { component: 'GeneralField', type: 'tel', label: 'Telephone' },
  pr_number: { component: 'GeneralField', type: 'text', label: 'Permanent Residence Card Number (PR card)' },
  status_in_canada: { component: 'SelectField', label: 'Status in Canada', options: statusInCanadaOptions }
}
