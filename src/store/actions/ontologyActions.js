import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES'


export function receiveCategories(type, categories) {
  return {
    type: RECEIVE_CATEGORIES,
    category_type: type,
    categories: categories
  }
}

export function fetchOntologyCategories(type) {
  return dispatch => {
    const url = serverHost + '/categories/' + type + '/';
    return fetch(url, { method: "GET" })
      .then(response => response.json())
      .then(json => {
        dispatch(receiveCategories(type, json['categories']))
      });
  }
}
