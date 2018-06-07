import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const RECEIVE_NEW_GOOD = 'RECEIVE_NEW_GOOD';
export const REQUEST_GOOD = 'REQUEST_GOOD';
export const RECEIVE_GOOD = 'RECEIVE_GOOD';
export const REQUEST_GOODS = 'REQUEST_GOODS';
export const RECEIVE_GOODS = 'RECEIVE_GOODS';
export const REMOVE_GOOD = 'REMOVE_GOOD';
export const SEARCH_GOODS = 'SEARCH_GOODS';


function requestGood(id) {
  return {
    type: REQUEST_GOOD,
    id: id
  }
}

function receiveGood(id, json) {
  return {
    type: RECEIVE_GOOD,
    id: id,
    good: json
  }
}

function requestGoods(json) {
  return {
    type: REQUEST_GOODS,
    goods: json
  }
}

function receiveGoods(json) {
  return {
    type: RECEIVE_GOODS,
    goods: json
  }
}

function removeGood(id) {
  return {
    type: REMOVE_GOOD,
    id: id
  }
}

export function searchGoods(searchValue, searchType) {
  return {
    type: SEARCH_GOODS,
    searchValue: searchValue,
    searchType: searchType
  };
}


export function fetchGood(id) {
  return dispatch => {
    dispatch(requestGood(id))
    const url = serverHost + '/good/' + id + '/';
    let good = null;
    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        good = json
        dispatch(receiveGood(id, json))
      })
  }
}

export function fetchGoods() {
  return dispatch => {
    dispatch(requestGoods())
    const url = serverHost + '/goods/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveGoods(json))
      })
  }
}

export function deleteGood(id) {
  return dispatch => {
    const url = serverHost + '/good/' + id + '/';

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      },
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeGood(id))
      }
    });
  }
}

export function createGood(params) {
  return dispatch => {
    const url = serverHost + '/goods/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(good => dispatch(receiveGood(good.id, good)));
  }
}

export function createGoods(params) {
  return dispatch => {
    const url = serverHost + '/goods/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({csv: params})
    })
  }
}

export function updateGood(id, params) {
  return dispatch => {
    const url = serverHost + '/good/' + id + '/';

    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(good => dispatch(receiveGood(id, good)));
  }
  console.log(params)
}
