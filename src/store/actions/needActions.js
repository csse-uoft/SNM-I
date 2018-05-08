import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const RECEIVE_NEEDS = 'RECEIVE_NEEDS';
export const RECEIVE_NEW_CLIENT_NEED = 'RECEIVE_NEW_CLIENT_NEED';
export const RECEIVE_UPDATED_CLIENT_NEED = 'RECEIVE_UPDATED_CLIENT_NEED';
export const REMOVE_CLIENT_NEED = 'REMOVE_CLIENT_NEED';
export const RECEIVE_UPDATED_NEED_MATCH_STATE = 'RECEIVE_UPDATED_NEED_MATCH_STATE';

export function receiveNeeds(clientId, json) {
  return {
    type: RECEIVE_NEEDS,
    clientId: clientId,
    needs: json,
    receivedAt: Date.now()
  }
}

function receiveNewClientNeed(clientId, json) {
  return {
    type: RECEIVE_NEW_CLIENT_NEED,
    clientId: clientId,
    need: json,
    receivedAt: Date.now()
  }
}

function receiveUpdatedClientNeed(clientId, needId, json) {
  return {
    type: RECEIVE_UPDATED_CLIENT_NEED,
    clientId: clientId,
    needId: needId,
    need: json,
    receivedAt: Date.now()
  }
}

function removeClientNeed(clientId, needId) {
  return {
    type: REMOVE_CLIENT_NEED,
    clientId: clientId,
    needId: needId,
    receivedAt: Date.now()
  }
}

function receiveUpdatedNeedMatchState(needId, json) {
  return {
    type: RECEIVE_UPDATED_NEED_MATCH_STATE,
    id: needId,
    need: json,
    receivedAt: Date.now()
  }
}

export function createClientNeed(clientId) {
  return dispatch => {
    const url = serverHost + '/client/' + clientId + '/needs/';
          
    return fetch(url, {method: "POST"}).then(response => response.json())
      .then(json => dispatch(receiveNewClientNeed(clientId, json)));
  }
}

export function updateClientNeed(clientId, needId, params) {
  return dispatch => {
    const url = serverHost + '/client/' + clientId + '/need/' + needId + '/';
          
    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveUpdatedClientNeed(clientId, needId, json)));
  }
}

export function deleteClientNeed(clientId, needId) {
  return dispatch => {
    const url = serverHost + '/client/' + clientId + '/need/' + needId + '/';
    return fetch(url, {method: "DELETE"}).then(response => {
      if (response.status === 200) {
        dispatch(removeClientNeed(clientId, needId))
      }
    });
  }
}

export function saveNeedMatchState(resourceId, needId, pending, fulfilled) {
  return dispatch => {
    const url = serverHost + '/need/' + needId + '/resource/' + resourceId + '/',
          params = { pending: pending, fulfilled: fulfilled };
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveUpdatedNeedMatchState(needId, json)));
  }
}

export function deleteNeedMatchState(resourceId, needId) {
  return dispatch => {
    const url = serverHost + '/need/' + needId + '/resource/' + resourceId + '/';
    return fetch(url, {method: "DELETE"})
      .then(response => response.json())
      .then(json => dispatch(receiveUpdatedNeedMatchState(needId, json)));
  }
}