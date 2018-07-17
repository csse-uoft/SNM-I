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

module.exports = Object.freeze({
  serverHost: serverHost,
  genderOptions: genderOptions,
  maritalStatusOptions: maritalStatusOptions
});
