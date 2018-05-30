import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';
import { receiveNeeds } from './needActions.js'

export const RECEIVE_NEW_PROVIDER = 'RECEIVE_NEW_PROVIDER';
export const REQUEST_PROVIDERS = 'REQUEST_PROVIDERS';
export const RECEIVE_PROVIDERS = 'RECEIVE_PROVIDERS';
export const REMOVE_PROVIDER = 'REMOVE_PROVIDER';
export const RECEIVE_PROVIDER = 'RECEIVE_PROVIDER';
export const REQUEST_PROVIDER = 'REQUEST_PROVIDER';
export const SEARCH_PROVIDERS = 'SEARCH_PROVIDERS';


function requestProviders() {
  return {
    type: REQUEST_PROVIDERS
  }
}

function receiveProviders(json) {
  return {
    type: RECEIVE_PROVIDERS,
    providers: json,
    receivedAt: Date.now(),
  }
}

function receiveNewProvider(json) {
  return {
    type: RECEIVE_NEW_PROVIDER,
    provider: json
  }
}

function removeProvider(id) {
  return {
    type: REMOVE_PROVIDER,
    id: id
  }
}

function receiveProvider(id, json) {
  return {
    type: RECEIVE_PROVIDER,
    provider: json,
    id: id
  }
}

function requestProvider(id) {
  return {
    type: REQUEST_PROVIDER,
    id: id
  }
}

export function searchProviders(value) {
  return {
    type: SEARCH_PROVIDERS,
    value: value
  };
}


export function fetchProvider(id) {
  return dispatch => {
    dispatch(requestProvider(id))
    const url = serverHost + '/provider/' + id + '/';

    return fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }), 
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveProvider(id, json))
      })
  }
}

export function fetchProviders(value) {
  return dispatch => {
    dispatch(requestProviders())
    const url = serverHost + '/providers/';

    return fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }), 
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveProviders(json))
      })
  }
}

export function createProvider(params) {
  return dispatch => {
    const url = serverHost + '/providers/';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveNewProvider(json)));
  }
}

export function updateProvider(id, params) {
  return dispatch => {
    const url = serverHost + '/provider/' + id + '/';
          
    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveNewProvider(json)));
  }
}

export function deleteProvider(id) {
  return dispatch => {
    const url = serverHost + '/provider/' + id + '/';
    return fetch(url, {
      method: "DELETE", 
      headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }), 
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeProvider(id))
      }
    });
  }
}

