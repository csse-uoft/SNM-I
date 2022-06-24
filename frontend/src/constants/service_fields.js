import {
  maritalStatusOptions, statusInCanadaOptions, educationLevelOptions, genderOptions,
  incomeSourceOptions, serviceTypeOptions
} from '../store/defaults.js';

const frequencyOptions = ['Weekly', 'Biweekly', 'Monthly', 'Non-repeated'];

export const serviceFields = {
  name: {label: 'Service Name', component: 'GeneralField'},
  type: {label: 'Service Type', component: 'SelectField', options: serviceTypeOptions},
  description: {label: 'Description', component: 'GeneralField'},
  category: {label: 'Category', component: 'SelectField', options: undefined},
  availableFrom: {label: 'Available From', component: 'GeneralField', type: 'date'},
  availableTo: {label: 'Available Until', component: 'GeneralField', type: 'date'},

  languages: {label: 'Languages', component: 'MultiSelectField'},


  maxCapacity: {label: 'Max Capacity', type: 'number'},
  // Current capacity shows up if max capacity > 0
  currentCapacity: {label: 'Current Capacity', type: 'number'},

  frequency: {label: 'Frequency', component: 'SelectField', options: frequencyOptions},

  billable: {label: 'Billable', component: 'RadioField', options: {'Yes': true, 'No': false}},
  // Price will show up if billable is true

}
