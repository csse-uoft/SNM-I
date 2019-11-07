const hostname = window && window.location && window.location.hostname;

let serverHost;
if (hostname === 'jias.snmi.ca') {
  serverHost = 'https://jias-server.snmi.ca';
}
else {
  serverHost = 'http://127.0.0.1:8000';
}


const ACTION_SUCCESS = 'ACTION_SUCCESS';
const ACTION_ERROR = 'ACTION_ERROR';

const torontoCoordinates = { lat: 43.6497, lng: -79.3763 };

const genderOptions = [
  'Female',
  'Male',
  'Other'
]

const maritalStatusOptions = [
  'Common Law',
  'Divorced',
  'Married',
  'Other',
  'Separated',
  'Single',
  'Widowed'
]

const statusInCanadaOptions = [
  'Application in Process - Family',
  'Application in Process - Humanitarian and Compassionate',
  'Application in Process - Independent',
  'Application in Process - Refugee',
  'Canadian Citizen',
  'Immigrant',
  'Other',
  'Permanent Resident - Business Class',
  'Permanent Resident - Canadian Experience Class',
  'Permanent Resident - Family Class',
  'Permanent Resident -  Humanitarian and Compassionate',
  'Permanent Resident - Live-in Caregiver',
  'Permanent Resident - Provincial Nominee',
  'Permanent Resident - Refugees',
  'Permanent Resident - Skilled Worker and Skilled Trades',
  'Temporary Resident',
  'Visitors Visa',
  'Work Permit'
]

const educationLevelOptions = [
  'College',
  'Elementary',
  'Post Graduate',
  'Secondary',
  'University'
]

const incomeSourceOptions = [
 'Crowd Ward',
 'Dependent of OW/ODSP',
 'Employment',
 'Employment Insurance',
 'Family Members Income',
 'None',
 'Ontario Disability Support Program',
 'Ontario Works',
 'Other',
 'Pension',
 'Unknown',
 'Workers Safety and Insurance'
]

const matchStatusOptions = [
  'Contacted',
  'Matched',
  'Referred',
  'Selected'
]

const familyRelationshipOptions = [
  'Child',
  'Parent',
  'Sibling',
  'Spouse'
]

const needStatusOptions = [
  'Fulfilled',
  'In Progress',
  'Matched',
  'Pending',
  'Unmatched'
]

const serviceTypeOptions = [
  'External',
  'Internal',
  'Professional/Community',
  'Volunteer based'
]

const serviceSharedWithOptions = [
  "Children's Aid Society of Toronto",
  "Durham Children's Aid Society",
  "Eva's Initiatives",
  'Abrigo Centre',
  'Adventist community services',
  'AIDS Committee of Durham Region',
  'Albion Neighbourhood Services',
  'Alexandra Park Community Centre',
  'Applegrove Community Complex',
  'Arab Community Centre of Toronto',
  'Aurora Food Pantry',
  'Barbra Schlifer Commemorative Clinic',
  'Bluffs Food Bank',
  'Boost Child & Youth Advocacy Centre',
  'Brock Community Food Bank',
  'Central Toronto Youth Services',
  'Covenant House Toronto',
  'Durham Rape Crisis Centre',
  'Durham Youth Housing and Support Services',
  'Horizons for Youth',
  'Kababayan Multicultural Centre',
  'Markham Food Bank',
  'Parkdale Community Food Bank',
  'Pediatric Oncology Group of Ontario',
  'Private',
  'Public'
]

const provinceOptions = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan'
]

module.exports = Object.freeze({
  serverHost: serverHost,
  torontoCoordinates: torontoCoordinates,
  genderOptions: genderOptions,
  maritalStatusOptions: maritalStatusOptions,
  statusInCanadaOptions: statusInCanadaOptions,
  educationLevelOptions: educationLevelOptions,
  incomeSourceOptions: incomeSourceOptions,
  matchStatusOptions: matchStatusOptions,
  familyRelationshipOptions: familyRelationshipOptions,
  needStatusOptions: needStatusOptions,
  serviceTypeOptions: serviceTypeOptions,
  serviceSharedWithOptions: serviceSharedWithOptions,
  provinceOptions: provinceOptions,
  ACTION_SUCCESS: ACTION_SUCCESS,
  ACTION_ERROR: ACTION_ERROR
});
