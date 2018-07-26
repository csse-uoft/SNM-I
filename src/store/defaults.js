const hostname = window && window.location && window.location.hostname;

let serverHost;
if (hostname === 'social-needs-marketplace.herokuapp.com') {
  serverHost = 'https://snm-impact-server.herokuapp.com';
}
else {
  serverHost = 'http://127.0.0.1:8000';
}

const genderOptions = [
  'Male',
  'Female',
  'Other'
]

const maritalStatusOptions = [
  'Single',
  'Married',
  'Common Law',
  'Separated',
  'Divorced',
  'Widowed'
]

const statusInCanadaOptions = [
  'Citizen',
  'Immigrant',
  'Refugee',
  'Work Permit',
  'Refugee Claimant',
  'Visitors Visa',
  'Other'
]

const educationLevelOptions = [
  'Elementary',
  'Secondary',
  'College',
  'University',
  'Post Graduate'
]

const incomeSourceOptions = [
 'Employment',
 'Employment Insurance',
 'Ontario Disability Support Program',
 'Ontario Works',
 'Dependent of OW/ODSP',
 'Family Members Income',
 'Workers Safety and Insurance',
 'Pension',
 'Crowd Ward',
 'Unknown',
 'None',
 'Other'
]

const matchStatusOptions = [
  'Fulfilled',
  'Referred'
]

const familyRelationshipOptions = [
  'Parent',
  'Spouse',
  'Child',
  'Sibling'
]

module.exports = Object.freeze({
  serverHost: serverHost,
  genderOptions: genderOptions,
  maritalStatusOptions: maritalStatusOptions,
  statusInCanadaOptions: statusInCanadaOptions,
  educationLevelOptions: educationLevelOptions,
  incomeSourceOptions: incomeSourceOptions,
  matchStatusOptions: matchStatusOptions,
  familyRelationshipOptions: familyRelationshipOptions,
});
