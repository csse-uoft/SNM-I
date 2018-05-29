import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const RECEIVE_NEW_CLIENT = 'RECEIVE_NEW_CLIENT';
export const REQUEST_CLIENT = 'REQUEST_CLIENT';
export const RECEIVE_CLIENT = 'RECEIVE_CLIENT';
export const REQUEST_CLIENTS = 'REQUEST_CLIENTS';
export const RECEIVE_CLIENTS = 'RECEIVE_CLIENTS';
export const REMOVE_CLIENT = 'REMOVE_CLIENT';


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
    client: json
  }
}

function requestClients(json) {
  return {
    type: REQUEST_CLIENTS,
    clients: json
  }
}

function receiveClients(json) {
  return {
    type: RECEIVE_CLIENTS,
    clients: json
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
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
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
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveClients(json))
      })
  }
}

export function deleteClient(id) {
  return dispatch => {
    const url = serverHost + '/client/' + id + '/';

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      },
    }).then(response => {
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
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(client => dispatch(receiveClient(client.id, client)));
  }
}

export function createClients(params) {
  return dispatch => {
    const url = serverHost + '/clients/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({csv: params})
    })
  }
}

export function updateClient(id, params) {
  return dispatch => {
    const url = serverHost + '/client/' + id + '/';

    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(client => dispatch(receiveClient(id, client)));
  }
  console.log(params)
}
