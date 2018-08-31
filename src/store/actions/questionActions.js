import fetch from 'isomorphic-fetch';
import { serverHost, ACTION_SUCCESS, ACTION_ERROR } from '../defaults.js';

export const REQUEST_QUESTION = 'REQUEST_QUESTION';
export const RECEIVE_QUESTION = 'RECEIVE_QUESTION';
export const REQUEST_QUESTIONS = 'REQUEST_QUESTIONS';
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';
export const REMOVE_QUESTION = 'REMOVE_QUESTION';


function requestQuestion(id) {
  return {
    type: REQUEST_QUESTION,
    id: id
  }
}

function receiveQuestion(id, json) {
  return {
    type: RECEIVE_QUESTION,
    id: id,
    question: json,
    receivedAt: Date.now()
  }
}

function requestQuestions() {
  return {
    type: REQUEST_QUESTIONS
  }
}

function receiveQuestions(json) {
  return {
    type: RECEIVE_QUESTIONS,
    questions: json,
    receivedAt: Date.now()
  }
}

function removeQuestion(id) {
  return {
    type: REMOVE_QUESTION,
    id: id
  }
}

export function createQuestion(params) {
  return dispatch => {
    const url = serverHost + '/questions/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(question => dispatch(receiveQuestion(question.id, question)));
  }
}


export function updateQuestion(id, params) {
  return dispatch => {
    const url = serverHost + '/questions/' + id + '/';
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(json => dispatch(receiveQuestion(id, json)));
  }
}

export function fetchQuestion(id) {
  return dispatch => {
    dispatch(requestQuestion(id))
    const url = serverHost + '/questions/' + id + '/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveQuestion(id, json))
      })
  }
}

export function fetchQuestions() {
  return dispatch => {
    dispatch(requestQuestions())
    const url = serverHost + '/questions/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveQuestions(json))
      })
  }
}

export function deleteQuestion(id, params, callback) {
  return dispatch => {
    const url = serverHost + '/questions/' + id + '/';

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
        dispatch(removeQuestion(id))
        callback(ACTION_SUCCESS);
      }
      else {
        callback(ACTION_ERROR);
      }
    })
  }
}
