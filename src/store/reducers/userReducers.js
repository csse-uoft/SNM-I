import { REQUEST_USERS, RECEIVE_USERS, REMOVE_USER,
         REQUEST_USER, RECEIVE_USER, UPDATE_USER } from '../actions/userActions.js';
import _ from 'lodash';

export function users(state = { usersLoaded: false, byId: {} }, action) {
  let nextById;
  switch (action.type) {
    case REQUEST_USERS:
      return { ...state, usersLoaded: false }
    case RECEIVE_USERS:
      const usersById = _.keyBy(action.users, user => user.id);
      return { ...state, byId: usersById, usersLoaded: true }
    case REMOVE_USER:
      nextById = _.clone(state.byId);
      delete nextById[action.id]
      return { ...state, byId: nextById }
    case REQUEST_USER:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return { ...state, byId: nextById }
    case RECEIVE_USER:
      nextById = {...state.byId, [action.id]: { ...action.user, loaded: true }}
      return { ...state, byId: nextById }
    case UPDATE_USER:
      nextById = {...state.byId, [action.user.id]: { ...action.user, loaded: true }}
      return { ...state, byId: nextById }
    default:
      return state
  }
}
