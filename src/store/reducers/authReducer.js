import { LOGIN_SUCCESS, LOGGED_OUT, UPDATE_ORGANIZATION } from '../actions/authAction.js';
import _ from 'lodash';

export function auth(state = {currentUser: null, isLoggedin: false, organization: { id: null, name: null }}, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        currentUser: action.user,
        isLoggedin: true,
        organization: action.organization
      })
    case LOGGED_OUT:
      return Object.assign({}, state, {
        currentUser: null,
        isLoggedin: false,
        organization: { id: null, name: null }
      })
    case UPDATE_ORGANIZATION:
      return Object.assign({}, state, {
        organization: {
          id: action.provider.id,
          name: action.provider.company
        }
      })
    default:
      return state
  }
}
