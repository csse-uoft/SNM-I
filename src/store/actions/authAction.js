import { serverHost } from '../defaults.js';
import jwt_decode from 'jwt-decode';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGGED_OUT = 'LOGGED_OUT';
export const UPDATE_ORGANIZATION = 'UPDATE_ORGANIZATION';
export const CLEAR_ALERT = 'CLEAR_ALERT';

function login_success(user, organization) {
  return {
    type: LOGIN_SUCCESS,
    user: user,
    organization: organization
  }
}

function login_failure(alert) {
  return {
    type: LOGIN_FAILURE,
    alert
  }
}

function logged_out(sessionExpired) {
  return {
    type: LOGGED_OUT,
    alert: sessionExpired && 'Your session has expired. Please login again.'
  }
}

export function updateAuthOrganization(provider) {
  return {
    type: UPDATE_ORGANIZATION,
    provider: provider
  }
}

export function login(params) {
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
        const error = await response.json()
        throw new Error(JSON.stringify(error['non_field_errors']))
      }
    })
    .then(json => {
      const decoded_token = jwt_decode(json.token);
      let user = (({ user_id, username, email }) => ({ user_id, username, email }))(decoded_token);
      user['expired_at'] = decoded_token['exp'] * 1000
      user['is_admin'] = json.is_admin
      const organization = {
        id: json.provider_id,
        name: json.organization_name
      }
      localStorage.setItem('jwt_token', json.token);
      dispatch(login_success(user, organization))
      return LOGIN_SUCCESS
    }).catch(err => {
      dispatch(login_failure('The username or password you entered is incorrect. Please try again.'))
      return LOGIN_FAILURE
    })
  }
}

export function logout(sessionExpired) {
  return dispatch => {
    dispatch(logged_out(sessionExpired))
    localStorage.removeItem('jwt_token');
  }
}

export function clearAlert() {
  return dispatch => {
    dispatch({
      type: CLEAR_ALERT
    })
  }
}
