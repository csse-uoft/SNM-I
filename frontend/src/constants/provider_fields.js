import { genderOptions } from '../store/defaults.js';
import { objectFlip } from '../helpers';

// const providerTypeOptions = ['Individual', 'Organization']
// const IndividualProviderOptions = ['Volunteer', 'Goods Donor', 'Professional Service Provider']
export const providerFormTypes = {
  'organization': 'Organization',
  'volunteer': 'Volunteer',
  // 'goods_donor': 'Goods Donor',
  // 'professional_service_provider': 'Professional Service Provider',
};

export const allForms = {
  client: 'Client',
  clientAssessment: 'Client Assessment',
  service: 'Service',
  appointment: 'Appointment',
  referral: 'Referral',
  serviceOccurrence: 'Service Occurrence',
  serviceRegistration: 'Service Registration',
  serviceProvision: 'Service Provision',
  needSatisfierOccurrence: 'Need Satisfier Occurrence',
  needOccurrence: 'Need Occurrence',
  ...providerFormTypes
};

export const providerCategoryValue2Key = objectFlip(providerFormTypes);
// const phoneTypes = ['Home', 'Cell', 'Work']
const providerStatus = ['External', 'Internal', 'Home Agency']
const commitmentOptions = ['Short term', 'Six months', 'One year']

export const providerFields = {
  alt_phone_number: {component: 'GeneralField', type: 'tel', label: 'Alternative phone number'},
  availability: {label: 'Availability'},
  commitment: {component: 'SelectField', label: 'Commitment length', options: commitmentOptions},
  company: {component: 'GeneralField', type: 'text', label: 'Company/Organization Name'},
  email: {component: 'GeneralField', type: 'email', label: 'Email'},
  first_name: {component: 'GeneralField', type: 'text', label: 'First Name'},
  gender: {component: 'SelectField', label: 'Gender', options: genderOptions},
  languages: {component: 'MultiSelectField', label: 'Languages'},
  last_name: {component: 'GeneralField', type: 'text', label: 'Last Name'},
  main_address: {label: 'Address'},
  notes: {component: 'GeneralField', type: 'text', label: 'Additional notes '},
  other_addresses: {label: 'Other Addresses'},
  own_car: {component: 'RadioField', label: 'Own a car?', options: {'Yes': true, 'No': false}},
  primary_contact: {label: 'Primary Contact'},
  primary_phone_number: {component: 'GeneralField', type: 'tel', label: 'Primary phone number'},
  reference1_email: {component: 'GeneralField', type: 'text', label: 'Reference 1 Email'},
  reference1_name: {component: 'GeneralField', type: 'text', label: 'Reference 1 Name'},
  reference1_phone: {component: 'GeneralField', type: 'text', label: 'Reference 1 phone'},
  reference2_email: {component: 'GeneralField', type: 'text', label: 'Reference 2 Email'},
  reference2_name: {component: 'GeneralField', type: 'text', label: 'Reference 2 Name'},
  reference2_phone: {component: 'GeneralField', type: 'text', label: 'Reference 2 phone'},
  referrer: {component: 'GeneralField', type: 'text', label: 'Referrer'},
  secondary_contact: {label: 'Secondary Contact'},
  skills: {component: 'GeneralField', type: 'text', label: 'Skills'},
  start_date: {component: 'GeneralField', type: 'date', label: 'Start date for availability'},
  status: {component: 'SelectField', label: 'Status', options: providerStatus},
  visibility: {
    component: 'RadioField',
    label: 'Allow other agencies to see this provider?',
    options: {'Yes': true, 'No': false}
  },
  sponsor: {component: 'GeneralField', type: 'text', label: 'Sponsor'}
}
