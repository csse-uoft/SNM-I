import { genderOptions, provinceOptions } from '../store/defaults.js';

export const profileFields = {
  first_name: { component: 'GeneralField', type: 'text', label: 'First Name' },
  middle_name: { component: 'GeneralField', type: 'text', label: 'Middle Name' },
  last_name: { component: 'GeneralField', type: 'text', label: 'Last Name' },
  preferred_name: { component: 'GeneralField', type: 'text', label: 'Preferred Name' },
  gender: { component: 'SelectField', label: 'Gender', options: genderOptions },
  birth_date: { component: 'GeneralField', type: 'date', label: 'Date of Birth' },
  email: { component: 'GeneralField', type: 'email', label: 'Email' },
  primary_phone_number: { component: 'GeneralField', type: 'tel', label: 'Telephone' },
  alt_phone_number: { component: 'GeneralField', type: 'tel', label: 'Alternative Phone Number' },
}

export const locationFields = {
  apt_number: { component: 'GeneralField', type: 'text', label: 'Apt. #' },
  first_name: { component: 'GeneralField', type: 'text', label: 'Street Address' },
  city: { component: 'GeneralField', type: 'text', label: 'City' },
  province: { component: 'SelectField', label: 'Province', options: provinceOptions },
  postal_code: { component: 'GeneralField', type: 'text', label: 'Postal Code' },
}
