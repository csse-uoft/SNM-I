import { serverHost, ACTION_SUCCESS, ACTION_ERROR } from '../defaults.js';


export function createAppointment(params, callback) {
  return dispatch => {
    const url = serverHost + '/appointments/';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
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
    .then(appointment => {
      callback(ACTION_SUCCESS, null, appointment);
    }).catch(err => {
      callback(ACTION_ERROR, err);
    })
  }
}
