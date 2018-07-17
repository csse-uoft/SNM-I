const hostname = window && window.location && window.location.hostname;
let backendHost;

if (hostname === 'social-needs-marketplace.herokuapp.com') {
  backendHost = 'https://snm-impact-server.herokuapp.com';
}
else {
  backendHost = 'http://127.0.0.1:8000';
}

export const serverHost = backendHost;
