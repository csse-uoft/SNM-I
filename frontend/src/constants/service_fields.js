import {
  maritalStatusOptions, statusInCanadaOptions, educationLevelOptions, genderOptions,
  incomeSourceOptions, serviceTypeOptions
} from '../store/defaults.js';

const frequencyOptions = ['Weekly', 'Biweekly', 'Monthly', 'Non-repeated'];

export const serviceFields = {
  name: {label: 'Service Name'},
  type: {label: 'Service Type', component: 'SelectField', options: serviceTypeOptions},
  description: {label: 'Description'},
  category: {label: 'Category', component: 'SelectField', options: undefined},
  availableFrom: {label: 'Available From', type: 'date'},
  availableTo: {label: 'Available Until', type: 'date'},

  languages: {component: 'MultiSelectField', label: 'Languages'},


  maxCapacity: {label: 'Max Capacity', type: 'number'},
  // Current capacity shows up if max capacity > 0
  currentCapacity: {label: 'Current Capacity', type: 'number'},

  frequency: {label: 'Frequency', component: 'SelectField', options: frequencyOptions},

  billable: {label: 'Billable', component: 'RadioField', options: {'Yes': true, 'No': false}},
  // Price will show up if billable is true

}
