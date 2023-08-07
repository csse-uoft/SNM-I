import { serverHost } from '../defaults.js';

export const RECEIVE_CLIENT_NEEDS = 'RECEIVE_CLIENT_NEEDS';
export const RECEIVE_CLIENT_NEED = 'RECEIVE_CLIENT_NEED';
export const REMOVE_CLIENT_NEED = 'REMOVE_CLIENT_NEED';
export const REQUEST_NEED = 'REQUEST_NEED';
export const REQUEST_NEEDS = 'REQUEST_NEEDS';
export const RECEIVE_NEEDS = 'RECEIVE_NEEDS';
export const RECEIVE_CLIENT_NEED_GROUP = 'RECEIVE_CLIENT_NEED_GROUP';
export const RECEIVE_CLIENT_NEED_INFO = ' RECEIVE_CLIENT_NEED_INFO';
export const ERROR = 'ERROR';

function requestOutcomes(json) {
  return {
    type: REQUEST_NEEDS,
    outcomes: json
  }
}

function receiveOutcomes(json) {
  return {
    type: RECEIVE_NEEDS,
    outcomes: json
  }
}

export function receiveClientOutcomes(clientId, json, outcomeGroups) {
  return {
    type: RECEIVE_CLIENT_NEEDS,
    clientId: clientId,
    outcomes: json,
    outcomeGroups: outcomeGroups
  }
}

function receiveClientOutcome(clientId, outcome, outcomeGroup) {
  return {
    type: RECEIVE_CLIENT_NEED,
    clientId: clientId,
    outcome: outcome,
    outcomeGroup: outcomeGroup
  }
}

function receiveClientOutcomeInfo(clientId, outcomeId, outcome) {
  return {
    type: RECEIVE_CLIENT_NEED_INFO,
    clientId: clientId,
    outcomeId: outcomeId,
    outcome: outcome
  }
}

function removeClientOutcome(clientId, outcomeId) {
  return {
    type: REMOVE_CLIENT_NEED,
    clientId: clientId,
    outcomeId: outcomeId
  }
}

function receiveClientOutcomeGroup(clientId, outcomeGroup) {
  return {
    type: RECEIVE_CLIENT_NEED_GROUP,
    clientId: clientId,
    outcomeGroup: outcomeGroup
  }
}

function requestOutcome(id) {
  return {
    type: REQUEST_NEED,
    outcomeId: id
  }
}

export function createClientOutcome(clientId, params) {
  return dispatch => {
    const url = serverHost + '/clients/' + clientId + '/outcomes/';

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(response => response.json())
    .then(outcomeInfo =>
      dispatch(receiveClientOutcome(clientId, outcomeInfo.outcome, outcomeInfo.outcome_group))
    );
  }
}

export function updateClientOutcome(clientId, outcomeId, params) {
  return dispatch => {
    const url = serverHost + '/clients/' + clientId + '/outcomes/' + outcomeId + '/';

    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(outcomeInfo => dispatch(receiveClientOutcome(clientId, outcomeInfo.outcome, outcomeInfo.outcome_group)));
  }
}

export function updateClientOutcomeGroup(clientId, outcomeGroupId, params) {
  return dispatch => {
    const url = serverHost + '/clients/' + clientId + '/outcome_groups/' + outcomeGroupId + '/';

    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(outcomeGroup => dispatch(receiveClientOutcomeGroup(clientId, outcomeGroup)));
  }
}

export function matchClientOutcome(outcomeId, params) {
  return dispatch => {
    const url = serverHost + '/outcomes/' + outcomeId + '/matches/';

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => response.json())
      .then(outcome => {
        dispatch(receiveClientOutcomeInfo(outcome.client_id, outcomeId, outcome))
      });
  }
}

export function deleteClientOutcome(clientId, outcomeId, params) {
  return dispatch => {
    const url = serverHost + '/clients/' + clientId + '/outcomes/' + outcomeId + '/';
    return fetch(url, {
      method: "DELETE",
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeClientOutcome(clientId, outcomeId))
      }
    });
  }
}

export function fetchOutcome(outcomeId, callback) {
  return dispatch => {
    dispatch(requestOutcome(outcomeId))
    const url = serverHost + '/outcomes/' + outcomeId;

    return fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(response => response.json())
    .then(outcome => {
      dispatch(receiveClientOutcomeInfo(outcome.client_id, outcome.id, outcome))
      callback(outcome)
    });
  }
}

export function fetchOutcomes() {
  return dispatch => {
    dispatch(requestOutcomes())
    const url = serverHost + '/outcomes/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveOutcomes(json))
      })
  }
}

export function updateMatchStatus(matchId, params) {
  return dispatch => {
    const url = serverHost + '/matches/' + matchId + '/';

    return fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(response => response.json())
    .then(outcome => dispatch(receiveClientOutcomeInfo(outcome.client_id, outcome.id, outcome)));
  }
}

export function createMatchNote(params) {
  return dispatch => {
    const url = serverHost + '/notes/';

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      }
    })
    .then(response => response.json())
    .then(outcome => dispatch(receiveClientOutcomeInfo(outcome.client_id, outcome.id, outcome)));
  }
}
