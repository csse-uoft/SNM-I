import { maritalStatusOptions, statusInCanadaOptions, educationLevelOptions,
         incomeSourceOptions } from '../store/defaults.js';
import { profileFields } from './shared_fields.js'


export const clientFields = {
  ...profileFields,
  file_id: { component: 'GeneralField', type: 'text', label: 'File ID' },
  marital_status: { component: 'SelectField', label: 'Marital Status', options: maritalStatusOptions },
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
