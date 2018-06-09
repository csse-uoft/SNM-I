import { serverHost } from '../defaults.js';
import jwt_decode from 'jwt-decode';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGGED_OUT = 'LOGGED_OUT';
export const UPDATE_ORGANIZATION = 'UPDATE_ORGANIZATION';

function login_success(user, organization) {
  return {
    type: LOGIN_SUCCESS,
    user: user,
    organization: organization
  }
}

function login_failure(error) {
  return {
    type: LOGIN_FAILURE,
    error: error
  }
}

function logged_out() {
  return {
    type: LOGGED_OUT
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
      user['is_admin'] = json.is_admin
      const organization = {
        id: json.provider_id,
        name: json.organization_name
      }
      localStorage.setItem('jwt_token', json.token);
      dispatch(login_success(user, organization))
      return LOGIN_SUCCESS
    }).catch(err => {
      dispatch(login_failure(err))
      return LOGIN_FAILURE
    })
  }
}

export function logout(params) {
  return dispatch => {
    dispatch(logged_out())
    localStorage.removeItem('jwt_token');
  }
}
