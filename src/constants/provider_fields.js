import { genderOptions, statusInCanadaOptions,
         educationLevelOptions, incomeSourceOptions } from '../store/defaults.js';

const providerTypeOptions = ['Individual', 'Organization']
const IndividualProviderOptions = ['Volunteer', 'Goods Donor', 'Professional Service Provider']
export const providerFormTypes = {
  'organization': 'Organization',
  'volunteer': 'Volunteer',
  'goods_donor': 'Goods Donor',
  'professional_service_provider': 'Professional Service Provider',
}
const phoneTypes = ['Home', 'Cell', 'Work']
const providerStatus = ['External', 'Internal', 'Home Agency']
const commitmentOptions = ['Short term', 'Six months', 'One year']

export const providerFields = {
  company: { component: 'GeneralField', type: 'text', label: 'Company/Organization Name' },
  languages: { component: 'MultiSelectField', label: 'Languages' },
  referrer: { component: 'GeneralField', type: 'text', label: 'Referrer' },
  notes: { component: 'GeneralField', type: 'text', label: 'Additional notes '},
  visibility: { component: 'RadioField', label: 'Allow other agencies to see this provider?', options: { 'Yes': true, 'No': false } },
  gender: { component: 'SelectField', label: 'Gender', options: genderOptions },
  first_name: { component: 'GeneralField', type: 'text', label: 'First Name' },
  last_name: { component: 'GeneralField', type: 'text', label: 'Last Name' },
  email: { component: 'GeneralField', type: 'email', label: 'Email' },
  primary_phone_number: { component: 'GeneralField', type: 'tel', label: 'Primary phone number' },
  primary_phone_extension: { component: 'GeneralField', type: 'text', label: 'Extension' },
  primary_phone_type: { component: 'SelectField', label: 'Primary phone type', options: phoneTypes },
  alt_phone_number: { component: 'GeneralField', type: 'tel', label: 'Alternative phone number' },
  alt_phone_extension: { component: 'GeneralField', type: 'text', label: 'Extension for Alternative phone number' },
  alt_phone_type: { component: 'SelectField', label: 'Alternative phone type', options: phoneTypes },
  sec_contact_first_name: { component: 'GeneralField', type: 'text', label: 'Secondary Contact First Name' },
  sec_contact_last_name: { component: 'GeneralField', type: 'text', label: 'Secondary Contact Last Name' },
  sec_contact_email: { component: 'GeneralField', type: 'email', label: 'Secondary Contact  Email' },
  sec_contact_primary_phone_number: { component: 'GeneralField', type: 'tel', label: 'Secondary Contact Primary phone number' },
  sec_contact_primary_phone_extension: { component: 'GeneralField', type: 'text', label: 'Secondary Contact Extension' },
  sec_contact_alt_phone_number: { component: 'GeneralField', type: 'tel', label: 'Secondary Contact Alternative phone number' },
  sec_contact_alt_phone_extension: { component: 'GeneralField', type: 'text', label: 'Secondary Contact Extension for Alternative phone number' },
  status: { component: 'SelectField', label: 'Status', options: providerStatus },
  start_date: { component: 'GeneralField', type: 'date', label: 'Start date for availability' },
  own_car: { component: 'RadioField', label: 'Own a car?', options: { 'Yes': true, 'No': false } },
  commitment: { component: 'SelectField', label: 'Commitment length', options: commitmentOptions },
  skills: { component: 'GeneralField', type: 'text', label: 'Skills' },
  reference1_name: { component: 'GeneralField', type: 'text', label: 'Reference 1 Name' },
  reference1_phone: { component: 'GeneralField', type: 'text', label: 'Reference 1 phone' },
  reference1_email: { component: 'GeneralField', type: 'text', label: 'Reference 1 Email' },
  reference2_name: { component: 'GeneralField', type: 'text', label: 'Reference 2 Name' },
  reference2_phone: { component: 'GeneralField', type: 'text', label: 'Reference 2 phone' },
  reference2_email: { component: 'GeneralField', type: 'text', label: 'Reference 2 Email' },
  main_address: { label: 'Address' },
  other_addresses: { label: 'Other Addresses' },
  availability: { label: 'Availability' }
}
