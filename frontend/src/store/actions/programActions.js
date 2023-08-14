import { serverHost, ACTION_SUCCESS, ACTION_ERROR } from '../defaults.js';

export const REQUEST_PROGRAM = 'REQUEST_PROGRAM';
export const RECEIVE_PROGRAM = 'RECEIVE_PROGRAM';
export const REQUEST_PROGRAMS = 'REQUEST_PROGRAMS';
export const REMOVE_PROGRAM = 'REMOVE_PROGRAM';
export const RECEIVE_PROGRAMS = 'RECEIVE_PROGRAMS';
export const SEARCH_PROGRAMS = 'SEARCH_PROGRAMS';


function requestProgram(id) {
  return {
    type: REQUEST_PROGRAM,
    id: id
  }
}

function receiveProgram(id, json) {
  return {
    type: RECEIVE_PROGRAM,
    id: id,
    program: json
  }
}

function requestPrograms(json) {
  return {
    type: REQUEST_PROGRAMS,
    programs: json
  }
}

function receivePrograms(json) {
  return {
    type: RECEIVE_PROGRAMS,
    programs: json
  }
}

function removeProgram(id) {
  return {
    type: REMOVE_PROGRAM,
    id: id
  }
}

export function searchPrograms(searchValue, searchType, sortType) {
  return {
    type: SEARCH_PROGRAMS,
    searchValue: searchValue,
    searchType: searchType,
    sortType: sortType
  };
}


export function fetchProgram(id) {
  return dispatch => {
    dispatch(requestProgram(id))
    const url = serverHost + '/program/' + id + '/';
    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(response => response.json())
      .then(json => {
        dispatch(receiveProgram(id, json))
      })
  }
}

export function fetchPrograms() {
  return dispatch => {
    dispatch(requestPrograms())
    const url = serverHost + '/programs/';

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
        },
      }).then(async(response) => {
        if (response.status === 200) {
          return response.json()
        }
        else {
          const error = await response.json()
          throw new Error(JSON.stringify(error))
        }
      })
      .then(json => {
        dispatch(receivePrograms(json))
        return json;
      })
      .catch(err => {
        return ACTION_ERROR;
      })
  }

}

// TODO: For later
export function deleteProgram(id, params, callback) {
  return dispatch => {
    const url = serverHost + '/program/' + id + '/';
    return fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(params),
      headers: {
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`,
        'Content-Type': 'application/json'
      },
    }).then(response => {
      if (response.status === 204) {
        dispatch(removeProgram(id))
        return ACTION_SUCCESS;
      }
      else {
        return ACTION_ERROR;
      }
    })
  }
}

export function createProgram(params, callback) {
  return dispatch => {
    const url = serverHost + '/programs/';
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
    .then(program => {
      dispatch(receiveProgram(program.id, program))
      callback(ACTION_SUCCESS, null, program.id);
    }).catch(err => {
      callback(ACTION_ERROR, err);
    })
  }
}

export function createPrograms(file) {
  const formData  = new FormData();
  formData.append('file', file)

  return dispatch => {
    const url = serverHost + '/programs.csv';
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
    .then(programs => {
      dispatch(receivePrograms(programs))
      return ACTION_SUCCESS
    })
    .catch(err => {
      return ACTION_ERROR
    })
  }
}

export function updateProgram(id, params, callback) {
  return dispatch => {
    const url = serverHost + '/program/' + id + '/';

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
      .then(program => {
        dispatch(receiveProgram(program.id, program))
        callback(ACTION_SUCCESS, null, program.id);
      }).catch(err => {
        callback(ACTION_ERROR, err);
      })
  }
}
