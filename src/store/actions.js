import fetch from 'isomorphic-fetch';
import { serverHost } from './defaults.js';

export const SEARCH_REQUESTED = 'SEARCH_REQUESTED';
export const SEARCH_RESPONSE_RECEIVED = 'SEARCH_RESPONSE_RECEIVED';
export const REQUEST_DASHBOARD_CLIENT_DATA = 'REQUEST_DASHBOARD_CLIENT_DATA';
export const RECEIEVE_DASHBOARD_CLIENT_DATA = 'RECEIEVE_DASHBOARD_CLIENT_DATA';

export const RECEIVE_NEW_RESOURCE = 'RECEIVE_NEW_RESOURCE';
export const REQUEST_RESOURCES = 'REQUEST_RESOURCES';
export const RECEIVE_RESOURCES = 'RECEIVE_RESOURCES';
export const REMOVE_RESOURCE = 'REMOVE_RESOURCE';

export const RECEIVE_NEW_GOOD = 'RECEIVE_NEW_GOOD';
export const REQUEST_GOODS = 'REQUEST_GOODS';
export const RECEIVE_GOODS = 'RECEIVE_GOODS';
export const REMOVE_GOODS = 'REMOVE_GOODS';


function resourceSearchRequested(needId) {
  return {
    type: SEARCH_REQUESTED,
    needId: needId
  }
}

function resourceSearchResponseReceived(needId, json) {
  return {
    type: SEARCH_RESPONSE_RECEIVED,
    needId: needId,
    providers: json,
    receivedAt: Date.now()
  }
}


function requestResources() {
  return {
    type: REQUEST_RESOURCES
  }
}

function receiveResources(json) {
  return {
    type: RECEIVE_RESOURCES,
    resources: json,
    receivedAt: Date.now()
  }
}

function receiveNewResource(json) {
  return {
    type: RECEIVE_NEW_RESOURCE,
    resource: json
  }
}

export function updateResource(id, params) {
  return dispatch => {
    const url = serverHost + '/resource/' + id + '/';
          
    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveNewResource(json)));
  }
}

function removeResource(id) {
  return {
    type: REMOVE_RESOURCE,
    id: id
  }
}

export function fetchProviderResources(needId, params) {
  return dispatch => {
    dispatch(resourceSearchRequested(needId))
    
    const paramsJSON = JSON.stringify(params),
          paramsUrlEncoded = encodeURIComponent(paramsJSON),
          url = serverHost + '/providers/resources/search/?params=' + paramsUrlEncoded;

    return fetch(url).then(response => response.json())
      .then(json => dispatch(resourceSearchResponseReceived(needId, json)))
  }
}

export function createResource(params) {
  return dispatch => {
    const url = serverHost + '/resource/';

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveNewResource(json)));
  }
}

export function fetchResources() {
  return dispatch => {
    dispatch(requestResources())
    const url = serverHost + '/resources/';

    return fetch(url).then(response => response.json())
      .then(json => {
        dispatch(receiveResources(json))
      })
  }
}

export function deleteResource(id) {
  return dispatch => {
    const url = serverHost + '/resource/' + id + '/';
    return fetch(url, {method: "DELETE"}).then(response => {
      if (response.status === 204) {
        dispatch(removeResource(id))
      }
    });
  }
}


export function fetchGoods() {
  return dispatch => {
    dispatch(requestGoods())
    const url = serverHost + '/goods/';
    return fetch(url).then(response => response.json())
      .then(json => {
        dispatch(receiveGoods(json))
      })
  }
}

function requestGoods() {
  return {
    type: REQUEST_GOODS
  }
}

function receiveGoods(json) {
  return {
    type: RECEIVE_GOODS,
    goods: json,
    receivedAt: Date.now()
  }
}

export function createGood(params) {
  return dispatch => {
    const url = serverHost + '/good/';
          
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveNewGood(json)));
  }
}

function receiveNewGood(json) {
  return {
    type: RECEIVE_NEW_GOOD,
    good: json
  }
}

export function updateGood(id, params) {
  return dispatch => {
    const url = serverHost + '/good/' + id + '/';
          
    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveNewGood(json)));
  }
}

export function deleteGood(id) {
  return dispatch => {
    const url = serverHost + '/good/' + id + '/';
    return fetch(url, {method: "DELETE"}).then(response => {
      if (response.status === 204) {
        dispatch(removeGood(id))
      }
    });
  }
}

function removeGood(id) {
  return {
    type: REMOVE_GOODS,
    id: id
  }
}
