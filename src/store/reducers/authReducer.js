import { LOGIN_SUCCESS, LOGGED_OUT } from '../actions/authAction.js';
import _ from 'lodash';

export function auth(state = {currentUser: null, isLoggedin: false}, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        currentUser: action.user,
        isLoggedin: true
      })
    case LOGGED_OUT:
      return Object.assign({}, state, {
        currentUser: null,
        isLoggedin: false
      })  
    default: 
      return state
  }
}
