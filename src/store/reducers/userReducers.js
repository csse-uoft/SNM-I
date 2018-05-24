import { REQUEST_USERS, RECEIVE_USERS, REMOVE_USER,
         REQUEST_USER, RECEIVE_USER, RECEIVE_NEW_USER,
         UPDATE_USER} from '../actions/userActions.js';
import _ from 'lodash';

export function users(state = {index: [], indexLoaded: false, byId: {} }, action) {
  let nextById, nextIndex;
  switch (action.type) {
    case REQUEST_USERS:
      return {...state, indexLoaded: false }
    case RECEIVE_USERS:
      return {...state, index: action.users, indexLoaded: true }
    case REMOVE_USER:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return {...state, index: nextIndex}
    case REQUEST_USER:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_USER:
      nextById = {...state.byId, [action.id]: { ...action.user, loaded: true }}
      return {...state, byId: nextById }
    case RECEIVE_NEW_USER:
      nextIndex = [...state.index, action.user]
      return {...state, index: nextIndex}
    case UPDATE_USER:
      nextIndex = _.clone(state.index);
      _.each(nextIndex, (user, index) => {
        if (user.id === action.user.id) {
          nextIndex[index] = action.user
        }
      });
      return {...state, index: nextIndex}
    default:
      return state
  }
}
