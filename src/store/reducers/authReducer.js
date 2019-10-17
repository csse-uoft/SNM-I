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
      console.log("File: authReducer.js, Function: auth, case LOGIN_SUCCESS, Parameters: state, action -> ", state, action)
      return Object.assign({}, state, {
        currentUser: action.user,
        isLoggedin: true,
        organization: action.organization,
        alert: null
      })
    case LOGIN_FAILURE:
      console.log("File: authReducer.js, Function: auth, case LOGIN_FAILURE, Parameters: state, action -> ", state, action)
      return Object.assign({}, state, {
        alert: action.alert
      })
    case LOGGED_OUT:
      console.log("File: authReducer.js, Function: auth, case LOGGED_OUT, Parameters: state, action -> ", state, action)
      return Object.assign({}, state, {
        currentUser: null,
        isLoggedin: false,
        organization: { id: null, name: null },
        alert: action.alert
      })
    case UPDATE_ORGANIZATION:
      console.log("File: authReducer.js, Function: auth, case UPDATE_ORGANIZATION, Parameters: state, action -> ", state, action)
      return Object.assign({}, state, {
        organization: {
          id: action.provider.id,
          name: action.provider.company
        }
      })
    case CLEAR_ALERT:
      console.log("File: authReducer.js, Function: auth, case CLEAR_ALERT, Parameters: state, action -> ", state, action)
      return Object.assign({}, state, {
        alert: null
      })
    default:
      return state
  }
}
