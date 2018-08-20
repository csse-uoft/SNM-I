import fetch from 'isomorphic-fetch';
import { serverHost, ACTION_SUCCESS, ACTION_ERROR } from '../defaults.js';

export const RECEIVE_CLIENT_FIELDS = 'RECEIVE_CLIENT_FIELDS'


export function receiveClientFields(formStructure, indexFields, stepsOrder) {
  return {
    type: RECEIVE_CLIENT_FIELDS,
    formStructure: formStructure,
    indexFields: indexFields,
    stepsOrder: stepsOrder
  }
}

export function fetchClientFields() {
  return dispatch => {
    const url = serverHost + '/settings/get_client_fields/';
    return fetch(url, { method: 'GET' })
      .then(response => response.json())
      .then(json => {
        dispatch(receiveClientFields(json['form_structure'],
                                     json['index_fields'],
                                     json['steps_order']))
      });
  }
}

export function updateClientFields(params, callback) {
  return dispatch => {
    const url = serverHost + '/settings/update_client_fields/';
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
        return response.json()
      }
      else {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
      }
    })
    .then(json => {
      dispatch(receiveClientFields(json['form_structure'],
                                   json['index_fields'],
                                   json['steps_order']))
      callback(ACTION_SUCCESS);
    }).catch(err => {
      callback(ACTION_ERROR);
    })
  }
}
