import { serverHost } from '../defaults.js';
import jwt_decode from 'jwt-decode';

export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';

function logged_in(user) {
  return {
    type: LOGGED_IN,
    user: user
  }
}

function logged_out() {
  return {
    type: LOGGED_OUT
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
      .then(response => response.json())
      .then(json => {
        const decoded_token = jwt_decode(json.token);
        let user = (({ user_id, username, email }) => ({ user_id, username, email }))(decoded_token);
        user['is_admin'] = json.is_admin
        localStorage.setItem('jwt_token', json.token);
        dispatch(logged_in(user))
      });
  }
}

export function logout(params) {
  return dispatch => {
    dispatch(logged_out())
    localStorage.removeItem('jwt_token');
  }
}
