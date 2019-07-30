import fetch from 'isomorphic-fetch';
import { serverHost, ACTION_SUCCESS, ACTION_ERROR } from '../defaults.js';

export const RECEIVE_NEW_SERVICE = 'RECEIVE_NEW_SERVICE';
export const RECEIVE_NEW_SERVICE_CSV = 'RECEIVE_NEW_SERVICE_CSV';
export const REQUEST_SERVICE = 'REQUEST_SERVICE';
export const RECEIVE_SERVICE = 'RECEIVE_SERVICE';
export const REQUEST_SERVICES = 'REQUEST_SERVICES';
export const REMOVE_SERVICE = 'REMOVE_SERVICE';
export const RECEIVE_ALL_SERVICES = 'RECEIVE_ALL_SERVICES';
export const RECEIVE_SERVICES = 'RECEIVE_SERVICES';
export const SEARCH_SERVICES = 'SEARCH_SERVICES';

function requestServices() {
  return {
    type: REQUEST_SERVICES
  }
}

function requestService(id) {
  return {
    type: REQUEST_SERVICE,
    id: id
  }
}

function receiveService(id, json) {
  return {
    type: RECEIVE_SERVICE,
    id: id,
    service: json
  }
}

function receiveServices(json) {
  return {
    type: RECEIVE_SERVICES,
    services: json
  }
}

function receiveNewService(id, json) {
  return {
    type: RECEIVE_NEW_SERVICE,
    id: id,
    provider: json
  }
}

function receiveNewServicesCSV(json) {
  return {
    type: RECEIVE_NEW_SERVICE_CSV,
    providers: json
  }
}

function removeService(id) {
  return {
    type: REMOVE_SERVICE,
    id: id
  }
}

export function searchServices(searchValue, searchType, sortType) {
  return {
    type: SEARCH_SERVICES,
    searchValue: searchValue,
    searchType: searchType,
    sortType: sortType
  };
}


export function fetchService(id) {
  return dispatch => {
    dispatch(requestService(id))
    const url = serverHost + '/service/' + id + '/';
    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveService(id, json))
      })
  }
}

export function fetchServices() {
  return dispatch => {
    dispatch(requestServices())
    const url = serverHost + '/services/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(async(response) => {
        if (response.status === 200) {
          return response.json()
        }
        else {
          const error = await response.json()
          throw new Error(JSON.stringify(error))
        }
      })
      .then(json => {
        dispatch(receiveServices(json))
      })
      .catch(err => {
        return ACTION_ERROR;
      })
  }
}

export function deleteService(id, params, callback) {
  return dispatch => {
    const url = serverHost + '/service/' + id + '/';
    return fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(params),
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`,
        'Content-Type': 'application/json'
      },
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeService(id))
        callback(ACTION_SUCCESS);
      }
      else {
        callback(ACTION_ERROR);
      }
    })
  }
}

export function createService(params, callback) {
  return dispatch => {
    const url = serverHost + '/services/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
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
    .then(service => {
      dispatch(receiveNewService(service.id, service))
      callback(ACTION_SUCCESS, null, service.id);
    }).catch(err => {
      callback(ACTION_ERROR, err);
    })
  }
}

export function createServices(file) {
  const formData  = new FormData();
  formData.append('file', file)

  return dispatch => {
    const url = serverHost + '/services.csv';
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
    .then(services => {
      dispatch(receiveNewServicesCSV(services))
      return ACTION_SUCCESS
    })
    .catch(err => {
      return ACTION_ERROR
    })
  }
}

export function updateService(id, params, callback) {
  return dispatch => {
    const url = serverHost + '/service/' + id + '/';

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
      .then(service => {
        dispatch(receiveNewService(service.id, service))
        callback(ACTION_SUCCESS, null, service.id);
      }).catch(err => {
        callback(ACTION_ERROR, err);
      })
  }
}
