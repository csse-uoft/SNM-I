import fetch from 'isomorphic-fetch';
import { serverHost, ACTION_SUCCESS, ACTION_ERROR } from '../defaults.js';

import { receiveClientNeeds } from './needActions'

export const REQUEST_CLIENT = 'REQUEST_CLIENT';
export const RECEIVE_CLIENT = 'RECEIVE_CLIENT';
export const REQUEST_CLIENTS = 'REQUEST_CLIENTS';
export const REMOVE_CLIENT = 'REMOVE_CLIENT';
export const RECEIVE_CLIENTS = 'RECEIVE_CLIENTS';
export const SEARCH_CLIENTS = 'SEARCH_CLIENTS';


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

export function searchClients(searchValue, searchType, sortType) {
  return {
    type: SEARCH_CLIENTS,
    searchValue: searchValue,
    searchType: searchType,
    sortType: sortType
  };
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
        dispatch(receiveClient(id, json));
        dispatch(receiveClientNeeds(id, json['needs'], json['need_groups']));
        return json;
      });
  }
}

export function fetchClients() {
  return dispatch => {
    dispatch(requestClients())
    let url = serverHost + '/clients/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      })
      .then(async(response) => {
        if (response.status === 200) {
          return response.json()
        }
        else {
          const error = await response.json()
          throw new Error(JSON.stringify(error))
        }
      })
      .then(json => {
        dispatch(receiveClients(json));
        return json;
      })
      .catch(err => {
        return ACTION_ERROR;
      })
  }
}


export function deleteClient(id, params) {
  return dispatch => {
    const url = serverHost + '/client/' + id + '/';
    return fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(params),
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`,
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      if (response.status === 204) {
        dispatch(removeClient(id));
        return ACTION_SUCCESS;
      }
      else {
        return ACTION_ERROR;
      }
    })
  }
}

export function createClient(params, callback) {
  console.log("createClient params", params);

  return dispatch => {
    const url = serverHost + '/clients/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(async(response) => {
      console.log("createClient response.status", response.status);
      if (response.status === 201) {
        return response.json()
      }
      else {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
      }
    })
    .then(client => {
      dispatch(receiveClient(client.id, client))
      callback(ACTION_SUCCESS, null, client.id);
    }).catch(err => {
      callback(ACTION_ERROR, err);
    })
  }
}

export function createClients(file) {
  const formData  = new FormData();
  formData.append('file', file)

  return dispatch => {
    const url = serverHost + '/clients.csv';
    return fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(async(response) => {
      if (response.status === 201) {
        return response.json()
      }
      else {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
      }
    })
    .then(clients => {
      dispatch(receiveClients(clients))
      return ACTION_SUCCESS;
    })
    .catch(err => {
      // dispatch(createFailure(err))
      return ACTION_ERROR;
    })
  }
}

export function updateClient(id, params, callback) {
  console.log("updateClient id, params", id, params);
  return dispatch => {
    const url = serverHost + '/client/' + id + '/';

    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(async(response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
      }
    })
    .then(client => {
      dispatch(receiveClient(client.id, client))
      callback(ACTION_SUCCESS, null, client.id);
    }).catch(err => {
      callback(ACTION_ERROR, err);
    })
  }
}
