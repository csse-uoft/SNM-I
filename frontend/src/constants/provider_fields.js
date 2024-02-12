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
  program: 'Program',
  appointment: 'Appointment',
  referral: 'Referral',
  serviceOccurrence: 'Service Occurrence',
  serviceRegistration: 'Service Registration',
  serviceProvision: 'Service Provision',
  serviceWaitlist: 'Service Waitlist',
  programOccurrence: 'Program Occurrence',
  programRegistration: 'Program Registration',
  programProvision: 'Program Provision',
  needSatisfierOccurrence: 'Need Satisfier Occurrence',
  needOccurrence: 'Need Occurrence',
  outcomeOccurrence: 'Outcome Occurrence',
  person: 'Person',
  ...providerFormTypes
};

