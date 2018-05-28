import { REQUEST_CLIENTS, RECEIVE_CLIENTS, REMOVE_CLIENT,
         REQUEST_CLIENT, RECEIVE_CLIENT, UPDATE_CLIENT, RECEIVE_NEW_CLIENT } from '../actions/userActions.js';
import _ from 'lodash';


export function clients(state = { index: [], indexLoaded: false, byId: {} }, action) {
  let nextById, nextIndex;
  switch (action.type) {
    case REQUEST_CLIENTS:
      return {...state, indexLoaded: false }
    case RECEIVE_CLIENTS:
      return {...state, index: action.clients, indexLoaded: true }
    case REMOVE_CLIENT:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return {...state, index: nextIndex}
    case REQUEST_CLIENT:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_CLIENT:
      nextById = {...state.byId, [action.id]: { ...action.client, loaded: true }}
      return {...state, byId: nextById }
    case RECEIVE_NEW_CLIENT:
      nextIndex = [action.client, ...state.index]
      return {...state, index: nextIndex}
    default:
      return state
  }
}
