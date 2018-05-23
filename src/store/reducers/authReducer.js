import { LOGGED_IN, LOGGED_OUT } from '../actions/authAction.js';
import _ from 'lodash';

export function auth(state = {currentUser: null, isLoggedin: false}, action) {
  switch (action.type) {
    case LOGGED_IN:
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
