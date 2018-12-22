import fetch from 'isomorphic-fetch';
import { serverHost } from '../defaults.js';

export const REQUEST_ADMIN_LOGS = 'REQUEST_ADMIN_LOGS';
export const RECEIVE_ADMIN_LOGS = 'RECEIVE_ADMIN_LOGS';


function requestAdminLogs() {
  return {
    type: REQUEST_ADMIN_LOGS
  }
}

function receiveAdminLogs(json) {
  return {
    type: RECEIVE_ADMIN_LOGS,
    logs: json
  }
}


export function fetchAdminLogs() {
  return dispatch => {
    dispatch(requestAdminLogs())
    const url = serverHost + '/admin_logs/';
    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveAdminLogs(json))
      })
  }
}
