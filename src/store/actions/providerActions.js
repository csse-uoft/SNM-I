import fetch from 'isomorphic-fetch';
import { serverHost, ACTION_SUCCESS, ACTION_ERROR } from '../defaults.js';
import { updateAuthOrganization } from './authAction.js'

export const REQUEST_PROVIDERS = 'REQUEST_PROVIDERS';
export const RECEIVE_PROVIDERS = 'RECEIVE_PROVIDERS';
export const REMOVE_PROVIDER = 'REMOVE_PROVIDER';
export const RECEIVE_PROVIDER = 'RECEIVE_PROVIDER';
export const REQUEST_PROVIDER = 'REQUEST_PROVIDER';
export const SEARCH_PROVIDERS = 'SEARCH_PROVIDERS';


function requestProviders(json) {
  return {
    type: REQUEST_PROVIDERS,
    providers: json
  }
}

function requestProvider(id) {
  console.log("requestProvider id", id);
  return {
    type: REQUEST_PROVIDER,
    id: id
  }
}

function receiveProvider(id, json) {
  console.log("receiveProvider json", json);
  return {
    type: RECEIVE_PROVIDER,
    provider: json,
    id: id
  }
}

function receiveProviders(json) {
  console.log("receiveProviders json", json);
  return {
    type: RECEIVE_PROVIDERS,
    providers: json,
    receivedAt: Date.now(),
  }
}

function removeProvider(id) {
  return {
    type: REMOVE_PROVIDER,
    id: id
  }
}


export function searchProviders(searchValue, searchType, searchProviderType, sortType) {
  return {
    type: SEARCH_PROVIDERS,
    searchValue: searchValue,
    searchType: searchType,
    displayType: searchProviderType, 
    sortType: sortType
  };
}


export function fetchProvider(id) {
  return dispatch => {
    console.log("fetchProvider, id", id);
    dispatch(requestProvider(id))
    const url = serverHost + '/provider/' + id + '/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        console.log("dispatch(receiveProvider id", id);
        dispatch(receiveProvider(id, json))
      })
  }
}

export function fetchProviders() {
  return dispatch => {
    dispatch(requestProviders())
    const url = serverHost + '/providers/';

    return fetch(url, {
        method: 'get',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      })
    //.then(response => response.json())
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
        dispatch(receiveProviders(json))
      })
      .catch(err => {
        return ACTION_ERROR;
      })
  }
}

export function createProvider(params, callback) {
  return dispatch => {
    const url = serverHost + '/providers/';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
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
    .then(provider => {
      dispatch(receiveProvider(provider.id, provider))
      if (provider.status === 'Home Agency') {
        dispatch(updateAuthOrganization(provider))
      }
      callback(ACTION_SUCCESS, null, provider.id);
    }).catch(err => {
      callback(ACTION_ERROR, err);
    })
  }
}

export function createProviderWithCSV(file) {
  const formData  = new FormData();
  formData.append('file', file);

  return dispatch => {
    const url = serverHost + '/providers/new/upload';
    return fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
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
    .then(providers => {
      dispatch(receiveProviders(providers))
      return ACTION_SUCCESS;
    })
      .catch(err => {
      return ACTION_ERROR;
    })
  }
}

export function updateProvider(id, params, callback) {
  console.log("updateProvider id, params", id, params);
  return dispatch => {
    const url = serverHost + '/provider/' + id + '/';

    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(async(response) => {
      if (response.status === 200) {
        return await response.json();
      }
      else {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
      }
    })
      .then(provider => {
        console.log("updateProvider provider.id, provider", provider.id, provider);
        dispatch(receiveProvider(provider.id, provider))
 /*       if (provider.status === 'Home Agency') {
          dispatch(updateAuthOrganization(provider.id, provider))
        } */
        callback(ACTION_SUCCESS, null, provider.id);
      }).catch(err => {
        callback(ACTION_ERROR, err);
    })
  }
}

/*
.then(client => {
      dispatch(receiveClient(client.id, client))
      callback(ACTION_SUCCESS, null, client.id);
    }).catch(err => {
      callback(ACTION_ERROR, err);

*/

export function deleteProvider(id, params, callback) {
  return dispatch => {
    const url = serverHost + '/provider/' + id + '/';

    return fetch(url, {
      method: "DELETE",
      body: JSON.stringify(params),
      headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeProvider(id))
        callback(ACTION_SUCCESS);
      }
      else {
        callback(ACTION_ERROR);
      }
    })
  }
}

export function rateProvider(id, params) {
  return dispatch => {
    const url = serverHost + '/provider/' + id + '/rate';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
  }
}