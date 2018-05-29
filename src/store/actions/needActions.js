import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const RECEIVE_CLIENT_NEEDS = 'RECEIVE_CLIENT_NEEDS';
export const RECEIVE_CLIENT_NEED = 'RECEIVE_CLIENT_NEED';
export const REMOVE_CLIENT_NEED = 'REMOVE_CLIENT_NEED';

export function receiveClientNeeds(clientId, json) {
  return {
    type: RECEIVE_CLIENT_NEEDS,
    clientId: clientId,
    needs: json
  }
}

function receiveClientNeed(clientId, needId, json) {
  return {
    type: RECEIVE_CLIENT_NEED,
    clientId: clientId,
    needId: needId,
    need: json
  }
}

function removeClientNeed(clientId, needId) {
  return {
    type: REMOVE_CLIENT_NEED,
    clientId: clientId,
    needId: needId
  }
}

export function createClientNeed(clientId, params) {
  return dispatch => {
    const url = serverHost + '/clients/' + clientId + '/needs/';

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(response => response.json())
    .then(need => dispatch(receiveClientNeed(clientId, need.id, need)));
  }
}

export function updateClientNeed(clientId, needId, params) {
  return dispatch => {
    const url = serverHost + '/clients/' + clientId + '/needs/' + needId + '/';

    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveClientNeed(clientId, needId, json)));
  }
}

export function deleteClientNeed(clientId, needId) {
  return dispatch => {
    const url = serverHost + '/clients/' + clientId + '/needs/' + needId + '/';
    return fetch(url, {
      method: "DELETE",
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeClientNeed(clientId, needId))
      }
    });
  }
}
