import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const RECEIVE_NEW_SERVICE = 'RECEIVE_NEW_SERVICE';
export const REQUEST_SERVICE = 'REQUEST_SERVICE';
export const RECEIVE_SERVICE = 'RECEIVE_SERVICE';
export const REQUEST_SERVICES = 'REQUEST_SERVICES';
export const RECEIVE_SERVICES = 'RECEIVE_SERVICES';
export const REMOVE_SERVICE = 'REMOVE_SERVICE';
export const SEARCH_SERVICES = 'SEARCH_SERVICES';


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

function requestServices(json) {
  return {
    type: REQUEST_SERVICES,
    services: json
  }
}

function receiveServices(json) {
  return {
    type: RECEIVE_SERVICES,
    services: json
  }
}

function removeService(id) {
  return {
    type: REMOVE_SERVICE,
    id: id
  }
}


export function fetchService(id) {
  return dispatch => {
    dispatch(requestService(id))
    const url = serverHost + '/service/' + id + '/';
    let service = null;
    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        service = json
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
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveServices(json))
      })
  }
}

export function deleteService(id) {
  return dispatch => {
    const url = serverHost + '/service/' + id + '/';

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      },
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeService(id))
      }
    });
  }
}

export function createService(params) {
  return dispatch => {
    const url = serverHost + '/services/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(service => dispatch(receiveService(service.id, service)));
  }
}

export function createServices(params) {
  return dispatch => {
    const url = serverHost + '/services/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({csv: params})
    })
  }
}

export function updateService(id, params) {
  return dispatch => {
    const url = serverHost + '/service/' + id + '/';

    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(service => dispatch(receiveService(id, service)));
  }
  console.log(params)
}

export function searchServices(searchValue, searchType) {
  return {
    type: SEARCH_SERVICES,
    searchValue: searchValue,
    searchType: searchType
  };
}
