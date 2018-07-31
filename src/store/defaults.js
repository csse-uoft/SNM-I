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
  'Widowed',
  'Other'
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

const needStatusOptions = [
  'Unmatched',
  'Pending',
  'In Progress',
  'Matched',
  'Fulfilled'
]

const serviceTypeOptions = [
  'Internal',
  'External',
  'Volunteer based',
  'Professional/Community'
]

const serviceSharedWithOptions = [
  'Private',
  'Public',
  'Boost Child & Youth Advocacy Centre',
  "Children's Aid Society of Toronto",
  'Abrigo Centre',
  'Barbra Schlifer Commemorative Clinic',
  'Durham Rape Crisis Centre',
  "Durham Children's Aid Society",
  'Alexandra Park Community Centre',
  'Applegrove Community Complex',
  'Albion Neighbourhood Services',
  'Kababayan Multicultural Centre',
  'Central Toronto Youth Services',
  'Covenant House Toronto',
  'Durham Youth Housing and Support Services',
  "Eva's Initiatives",
  'Horizons for Youth',
  'AIDS Committee of Durham Region',
  'Arab Community Centre of Toronto',
  'Pediatric Oncology Group of Ontario',
  'Adventist community services',
  'Aurora Food Pantry',
  'Bluffs Food Bank',
  'Brock Community Food Bank',
  'Markham Food Bank',
  'Parkdale Community Food Bank'
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
  needStatusOptions: needStatusOptions,
  serviceTypeOptions: serviceTypeOptions,
  serviceSharedWithOptions: serviceSharedWithOptions
});
