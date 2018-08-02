import fetch from 'isomorphic-fetch';
import { serverHost, ACTION_SUCCESS, ACTION_ERROR } from '../defaults.js';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const REMOVE_USER = 'REMOVE_USER';


function requestUser(id) {
  return {
    type: REQUEST_USER,
    id: id
  }
}

function receiveUser(id, json) {
  return {
    type: RECEIVE_USER,
    id: id,
    user: json,
    receivedAt: Date.now()
  }
}

function requestUsers() {
  return {
    type: REQUEST_USERS
  }
}

function receiveUsers(json) {
  return {
    type: RECEIVE_USERS,
    users: json,
    receivedAt: Date.now()
  }
}

function removeUser(id) {
  return {
    type: REMOVE_USER,
    id: id
  }
}

export function createUser(params) {
  return dispatch => {
    const url = serverHost + '/users/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(user => dispatch(receiveUser(user.id, user)));
  }
}

export function createUsers(params) {
  return dispatch => {
    const url = serverHost + '/users/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({csv: params})
    })
  }
}


export function updateUser(id, params) {
  return dispatch => {
    const url = serverHost + '/user/' + id + '/';
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveUser(id, json)));
  }
}

export function fetchUser(id) {
  return dispatch => {
    dispatch(requestUser(id))
    const url = serverHost + '/user/' + id + '/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveUser(id, json))
      })
  }
}

export function fetchUsers() {
  return dispatch => {
    dispatch(requestUsers())
    const url = serverHost + '/users/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveUsers(json))
      })
  }
}

export function deleteUser(id, params, callback) {
  return dispatch => {
    const url = serverHost + '/user/' + id + '/';

    return fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(params),
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`,
        'Content-Type': 'application/json'
      },
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeUser(id))
        callback(ACTION_SUCCESS);
      }
      else {
        callback(ACTION_ERROR);
      }
    });
  }
}
