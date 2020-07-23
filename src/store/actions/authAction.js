import { serverHost } from '../defaults.js';
import jwt_decode from 'jwt-decode';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGGED_OUT = 'LOGGED_OUT';
export const UPDATE_ORGANIZATION = 'UPDATE_ORGANIZATION';

function login_success(user, organization) {
  console.log("File: authActions.js - Function: login_success - Parameters: user, organization. - Values: ", user, organization);
  return {
    type: LOGIN_SUCCESS,
    user: user,
    organization: organization
  }
}

function login_failure(alert) {
  console.log("File: authActions.js -  Function: login_failure - Parameters: alert - Values:  ", alert);
  return {
    type: LOGIN_FAILURE,
    alert
  }
}

function logged_out(sessionExpired) {
  console.log("File: authActions.js -  Function: logged_out - Parameters: sessionExpired - Values: ", sessionExpired);
  return {
    type: LOGGED_OUT,
    alert: sessionExpired && 'Your session has expired. Please login again.'
  }
}

export function updateAuthOrganization(provider) {
  console.log("File: authActions.js -  Function: updateAuthOrganization - Parameters: provider - Values:", provider);
  return {
    type: UPDATE_ORGANIZATION,
    provider: provider
  }
}

export function login(params) {
  console.log("File: authActions.js -  Function: login -  Parameters: params - Values:  ", params);
  return dispatch => {
    const url = serverHost + '/api-token-auth/';

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(async(response) => {
      if (response.status === 200) {
        return response.json()
      }
      else {
        const error = await response.json();
        throw new Error(JSON.stringify(error['non_field_errors']))
      }
    })
    .then(json => {
      console.log("File: authActions.js -  Function: login - Step 2  json:  ", json);
      const decoded_token = jwt_decode(json.token);
      let user = (({ user_id, username, email }) => ({ user_id, username, email }))(decoded_token);
      user['expired_at'] = decoded_token['exp'] * 1000;
      user['is_admin'] = json.is_admin;
      const organization = {
        id: json.provider_id,
        name: json.organization_name
      };
      localStorage.setItem('jwt_token', json.token);
      dispatch(login_success(user, organization));
      return {status: LOGIN_SUCCESS}
    }).catch(err => {
      let alert;
      if (err.message === "Failed to fetch") {
        alert = 'Server is unavailable due to a temporary outage.'
      }
      else {
        alert = 'The username or password you entered is incorrect. Please try again.'
      }
      dispatch(login_failure(alert));
      return {status: LOGIN_FAILURE, message: alert};
    })
  }
}

export function logout(sessionExpired) {
  return dispatch => {
    dispatch(logged_out(sessionExpired))
    localStorage.removeItem('jwt_token');
  }
}
