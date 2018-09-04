import { genderOptions, maritalStatusOptions, statusInCanadaOptions,
         educationLevelOptions, incomeSourceOptions } from '../store/defaults.js';

export const clientFields = {
  file_id: { component: 'GeneralField', type: 'text', label: 'File ID' },
  first_name: { component: 'GeneralField', type: 'text', label: 'First Name' },
  middle_name: { component: 'GeneralField', type: 'text', label: 'Middle Name' },
  last_name: { component: 'GeneralField', type: 'text', label: 'Last Name' },
  preferred_name: { component: 'GeneralField', type: 'text', label: 'Preferred Name' },
  gender: { component: 'SelectField', label: 'Gender', options: genderOptions },
  birth_date: { component: 'GeneralField', type: 'date', label: 'Date of Birth' },
  marital_status: { component: 'SelectField', label: 'Marital Status', options: maritalStatusOptions },
  email: { component: 'GeneralField', type: 'email', label: 'Email' },
  primary_phone_number: { component: 'GeneralField', type: 'tel', label: 'Telephone' },
  alt_phone_number: { component: 'GeneralField', type: 'tel', label: 'Alternative Phone Number' },
  status_in_canada: { component: 'SelectField', label: 'Status in Canada', options: statusInCanadaOptions },
  country_of_origin: { component: 'GeneralField', type: 'text', label: 'Country of Origin' },
  country_of_last_residence: { component: 'GeneralField', type: 'text', label: 'Country of Last Residence' },
  landing_date: { component: 'GeneralField', type: 'date', label: 'Landing Date' },
  arrival_date: { component: 'GeneralField', type: 'date', label: 'Arrival Date (if different from landing_date)' },
  current_education_level: { component: 'SelectField', label: 'Current Education Level', options: educationLevelOptions },
  completed_education_level: { component: 'SelectField', label: 'Completed Education Level', options: educationLevelOptions },
  income_source: { component: 'SelectField', label: 'Income Source', options: incomeSourceOptions },
  pr_number: { component: 'GeneralField', type: 'text', label: 'Permanent Residence Card Number (PR card)' },
  immigration_doc_number: { component: 'GeneralField', type: 'text', label: 'Immigration Document Number (if different from PR card)' },
  num_of_dependants: { component: 'GeneralField', type: 'number', label: 'Number of Dependants' },
  num_of_children: { component: 'GeneralField', type: 'number', label: 'Number of Children' },
  has_children: { component: 'RadioField', label: 'Do you have children?', options: { 'Yes': true, 'No': false } },
  other_languages: { component: 'MultiSelectField', label: 'Other languages' },
  first_language: { component: 'SelectField', label: 'First Language' },
  eligibilities: { component: 'CheckboxField', label: 'Eligibilities' },
  address: { label: 'Address' },
  family: { label: 'Family' }
}
