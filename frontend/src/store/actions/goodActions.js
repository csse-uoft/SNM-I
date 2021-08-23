import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const REQUEST_GOOD = 'REQUEST_GOOD';
export const RECEIVE_GOOD = 'RECEIVE_GOOD';
export const REQUEST_GOODS = 'REQUEST_GOODS';
export const RECEIVE_ALL_GOODS = 'RECEIVE_ALL_GOODS';
export const REMOVE_GOOD = 'REMOVE_GOOD';
export const RECEIVE_GOODS = 'RECEIVE_GOODS';
export const GOOD_ERROR = 'GOOD_ERROR';
export const GOOD_SUCCESS = 'GOOD_SUCCESS';
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

export function searchGoods(searchValue, searchType, sortType) {
  return {
    type: SEARCH_GOODS,
    searchValue: searchValue,
    searchType: searchType,
    sortType: sortType
  };
}


export function fetchGood(id) {
  return dispatch => {
    dispatch(requestGood(id))
    const url = serverHost + '/good/' + id + '/';
    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
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
        dispatch(receiveGoods(json));
        return json;
      })
  }
}

export function deleteGood(id, params) {
  return dispatch => {
    const url = serverHost + '/good/' + id + '/';

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
        dispatch(removeGood(id))
        return GOOD_SUCCESS
      }
      else {
        return GOOD_ERROR
      }
    });
  }
}

export function createGood(params, callback) {
  return dispatch => {
    const url = serverHost + '/goods/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(async(response) => {
      if (response.status === 201) {
        return response.json()
      }
      else {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
      }
    })
    .then(good => {
      dispatch(receiveGood(good.id, good))
      callback(GOOD_SUCCESS, null, good.id);
    }).catch(err => {
      callback(GOOD_ERROR, err);
    })
  }
}

export function createGoods(file) {
  const formData  = new FormData();
  formData.append('file', file)

  return dispatch => {
    const url = serverHost + '/goods.csv';
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
    .then(goods => {
      dispatch(receiveGoods(goods))
      return GOOD_SUCCESS
    })
    .catch(err => {
      return GOOD_ERROR
    })
  }
}

export function updateGood(id, params, callback) {
  return dispatch => {
    const url = serverHost + '/good/' + id + '/';

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
      .then(good => {
        dispatch(receiveGood(good.id, good))
        callback(GOOD_SUCCESS, null, good.id);
      }).catch(err => {
        callback(GOOD_ERROR, err);
      })
  }
}
