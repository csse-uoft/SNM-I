import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const RECEIVE_NEW_CLIENT = 'RECEIVE_NEW_CLIENT';
export const REQUEST_CLIENT = 'REQUEST_CLIENT';
export const RECEIVE_CLIENT = 'RECEIVE_CLIENT';
export const REQUEST_CLIENTS = 'REQUEST_CLIENTS';
export const RECEIVE_CLIENTS = 'RECEIVE_CLIENTS';
export const REMOVE_CLIENT = 'REMOVE_CLIENT';


function receiveNewClient(json) {
  return {
    type: RECEIVE_NEW_CLIENT,
    client: json
  }
}

function requestClient(id) {
  return {
    type: REQUEST_CLIENT,
    id: id
  }
}

function receiveClient(id, json) {
  return {
    type: RECEIVE_CLIENT,
    id: id,
    client: json,
    receivedAt: Date.now()
  }
}

function requestClients() {
  return {
    type: REQUEST_CLIENTS
  }
}

function receiveClients(json) {
  return {
    type: RECEIVE_CLIENTS,
    clients: json,
    receivedAt: Date.now()
  }
}

function removeClient(id) {
  return {
    type: REMOVE_CLIENT,
    id: id
  }
}


export function fetchClient(id) {
  return dispatch => {
    dispatch(requestClient(id))
    const url = serverHost + '/client/' + id + '/';

    return fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }),
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveClient(id, json))
      })
  }
}

export function fetchClients() {
  return dispatch => {
    dispatch(requestClients())
    const url = serverHost + '/clients/';

    return fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        }),
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveClients(json))
      })
  }
}

export function deleteClient(id) {
  return dispatch => {
    const url = serverHost + '/client/' + id + '/';
    return fetch(url, {method: "DELETE"}).then(response => {
      if (response.status === 204) {
        dispatch(removeClient(id))
      }
    });
  }
}

export function createClient(params) {
  return dispatch => {
    const url = serverHost + '/clients/';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveNewClient(json)));
  }
}

export function createClients(params) {
  return dispatch => {
    const url = serverHost + '/clients/';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({csv: params})
    })
  }
}

export function updateClient(id, params) {
  return dispatch => {
    const url = serverHost + '/client/' + id + '/';

    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveNewClient(json)));
  }
  console.log(params)
}
