import { LOGIN_SUCCESS, LOGGED_OUT, UPDATE_ORGANIZATION, LOGIN_FAILURE,
  CLEAR_ALERT } from '../actions/authAction.js';
import _ from 'lodash';

const DEFAULT_STATE = {
  currentUser: null,
  isLoggedin: false,
  organization: { id: null, name: null },
  alert: null
}

export function auth(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        currentUser: action.user,
        isLoggedin: true,
        organization: action.organization,
        alert: null
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        alert: action.alert
      })
    case LOGGED_OUT:
      return Object.assign({}, state, {
        currentUser: null,
        isLoggedin: false,
        organization: { id: null, name: null },
        alert: action.alert
      })
    case UPDATE_ORGANIZATION:
      return Object.assign({}, state, {
        organization: {
          id: action.provider.id,
          name: action.provider.company
        }
      })
    case CLEAR_ALERT:
      return Object.assign({}, state, {
        alert: null
      })
    default:
      return state
  }
}
