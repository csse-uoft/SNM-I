import fetch from 'isomorphic-fetch';
import { serverHost } from './defaults.js';
import { receiveNeeds } from './actions/needActions.js'

export const RECEIVE_PROVIDER = 'RECEIVE_PROVIDER';
export const REQUEST_PROVIDER = 'REQUEST_PROVIDER';

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
