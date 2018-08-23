import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const RECEIVE_CLIENT_NEEDS = 'RECEIVE_CLIENT_NEEDS';
export const RECEIVE_CLIENT_NEED = 'RECEIVE_CLIENT_NEED';
export const REMOVE_CLIENT_NEED = 'REMOVE_CLIENT_NEED';
export const REQUEST_NEED = 'REQUEST_NEED';
export const REQUEST_NEEDS = 'REQUEST_NEEDS';
export const RECEIVE_NEEDS = 'RECEIVE_NEEDS';
export const RECEIVE_CLIENT_NEED_GROUP = 'RECEIVE_CLIENT_NEED_GROUP';
export const RECEIVE_CLIENT_NEED_INFO = ' RECEIVE_CLIENT_NEED_INFO';
export const ERROR = 'ERROR';

function requestNeeds(json) {
  return {
    type: REQUEST_NEEDS,
    needs: json
  }
}

function receiveNeeds(json) {
  return {
    type: RECEIVE_NEEDS,
    needs: json
  }
}

export function receiveClientNeeds(clientId, json, needGroups) {
  return {
    type: RECEIVE_CLIENT_NEEDS,
    clientId: clientId,
    needs: json,
    needGroups: needGroups
  }
}

function receiveClientNeed(clientId, need, needGroup) {
  return {
    type: RECEIVE_CLIENT_NEED,
    clientId: clientId,
    need: need,
    needGroup: needGroup
  }
}

function receiveClientNeedInfo(clientId, needId, need) {
  return {
    type: RECEIVE_CLIENT_NEED_INFO,
    clientId: clientId,
    needId: needId,
    need: need
  }
}

function removeClientNeed(clientId, needId) {
  return {
    type: REMOVE_CLIENT_NEED,
    clientId: clientId,
    needId: needId
  }
}

function receiveClientNeedGroup(clientId, needGroup) {
  return {
    type: RECEIVE_CLIENT_NEED_GROUP,
    clientId: clientId,
    needGroup: needGroup
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
    .then(needInfo => dispatch(receiveClientNeed(clientId, needInfo.need, needInfo.need_group)));
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
      .then(needInfo => dispatch(receiveClientNeed(clientId, needInfo.need, needInfo.need_group)));
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
      .then(needGroup => dispatch(receiveClientNeedGroup(clientId, needGroup)));
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
        dispatch(receiveClientNeedInfo(need.person_id, needId, need))
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
    .then(need => dispatch(receiveClientNeedInfo(need.person_id, need.id, need)));
  }
}

export function fetchNeeds() {
  return dispatch => {
    dispatch(requestNeeds())
    const url = serverHost + '/needs/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveNeeds(json))
      })
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
    .then(need => dispatch(receiveClientNeedInfo(need.person_id, need.id, need)));
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
    .then(need => dispatch(receiveClientNeedInfo(need.person_id, need.id, need)));
  }
}
