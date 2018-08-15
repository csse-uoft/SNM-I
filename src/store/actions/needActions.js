import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const RECEIVE_CLIENT_NEEDS = 'RECEIVE_CLIENT_NEEDS';
export const RECEIVE_CLIENT_NEED = 'RECEIVE_CLIENT_NEED';
export const REMOVE_CLIENT_NEED = 'REMOVE_CLIENT_NEED';
export const REQUEST_NEED = 'REQUEST_NEED';
export const RECEIVE_CLIENT_NEED_GROUP = 'RECEIVE_CLIENT_NEED_GROUP';
export const ERROR = 'ERROR';

export function receiveClientNeeds(clientId, json, needGroups) {
  return {
    type: RECEIVE_CLIENT_NEEDS,
    clientId: clientId,
    needs: json,
    needGroups: needGroups
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

function receiveClientNeedGroup(clientId, needGroupId, json) {
  return {
    type: RECEIVE_CLIENT_NEED_GROUP,
    clientId: clientId,
    needGroupId: needGroupId,
    needGroup: json
  }
}

function requestNeed(id) {
  return {
    type: REQUEST_NEED,
    needId: id
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

export function updateClientNeedGroup(clientId, needGroupId, params) {
  return dispatch => {
    const url = serverHost + '/clients/' + clientId + '/need_groups/' + needGroupId + '/';

    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveClientNeedGroup(clientId, needGroupId, json)));
  }
}

export function matchClientNeed(needId, params) {
  return dispatch => {
    const url = serverHost + '/needs/' + needId + '/matches/';

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(need => {
        dispatch(receiveClientNeed(need.client_id, needId, need))
      });
  }
}

export function deleteClientNeed(clientId, needId, params) {
  return dispatch => {
    const url = serverHost + '/clients/' + clientId + '/needs/' + needId + '/';
    return fetch(url, {
      method: "DELETE",
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeClientNeed(clientId, needId))
      }
    });
  }
}

export function fetchNeed(needId) {
  return dispatch => {
    dispatch(requestNeed(needId))
    const url = serverHost + '/needs/' + needId;

    return fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(response => response.json())
    .then(need => dispatch(receiveClientNeed(need.client_id, need.id, need)));
  }
}

export function updateMatchStatus(matchId, params) {
  return dispatch => {
    const url = serverHost + '/matches/' + matchId + '/';

    return fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(response => response.json())
    .then(need => dispatch(receiveClientNeed(need.client_id, need.id, need)));
  }
}

export function createMatchNote(params) {
  return dispatch => {
    const url = serverHost + '/notes/';

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(response => response.json())
    .then(need => dispatch(receiveClientNeed(need.client_id, need.id, need)));
  }
}
