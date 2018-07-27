import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const REQUEST_ELIGIBILITY = 'REQUEST_ELIGIBILITY';
export const RECEIVE_ELIGIBILITY = 'RECEIVE_ELIGIBILITY';
export const REQUEST_ELIGIBILITIES = 'REQUEST_ELIGIBILITIES';
export const RECEIVE_ELIGIBILITIES = 'RECEIVE_ELIGIBILITIES';
export const REMOVE_ELIGIBILITY = 'REMOVE_ELIGIBILITY_';


function requestEligibility(id) {
  return {
    type: REQUEST_ELIGIBILITY,
    id: id
  }
}

function receiveEligibility(id, json) {
  return {
    type: RECEIVE_ELIGIBILITY,
    id: id,
    eligibility: json,
    receivedAt: Date.now()
  }
}

function requestEligibilities() {
  return {
    type: REQUEST_ELIGIBILITIES
  }
}

function receiveEligibilities(json) {
  return {
    type: RECEIVE_ELIGIBILITIES,
    eligibilities: json,
    receivedAt: Date.now()
  }
}

function removeEligibility(id) {
  return {
    type: REMOVE_ELIGIBILITY,
    id: id
  }
}

export function createEligibility(params) {
  return dispatch => {
    const url = serverHost + '/eligibility_criteria/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(eligibility => dispatch(receiveEligibility(eligibility.id, eligibility)));
  }
}


export function updateEligibility(id, params) {
  return dispatch => {
    const url = serverHost + '/eligibility_criteria/' + id + '/';
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveEligibility(id, json)));
  }
}

export function fetchEligibility(id) {
  return dispatch => {
    dispatch(requestEligibility(id))
    const url = serverHost + '/eligibility_criteria/' + id + '/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveEligibility(id, json))
      })
  }
}

export function fetchEligibilities() {
  return dispatch => {
    dispatch(requestEligibilities())
    const url = serverHost + '/eligibility_criteria/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveEligibilities(json))
      })
  }
}

export function deleteEligibility(id) {
  return dispatch => {
    const url = serverHost + '/eligibility_criteria/' + id + '/';

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      },
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeEligibility(id))
      }
    });
  }
}
