import { REQUEST_CLIENTS, RECEIVE_CLIENTS, REMOVE_CLIENT,
         REQUEST_CLIENT, RECEIVE_CLIENT } from '../actions/clientActions.js';
import _ from 'lodash';


export function clients(state = { clientsLoaded: false, byId: {} }, action) {
  let nextById;
  switch (action.type) {
    case REQUEST_CLIENTS:
      return {...state, clientsLoaded: false }
    case RECEIVE_CLIENTS:
      nextById = _.keyBy(action.clients, client => client.id);
      return {...state, byId: nextById, clientsLoaded: true }
    case REMOVE_CLIENT:
      nextById = _.clone(state.byId);
      delete nextById[action.id]
      return { ...state, byId: nextById }
    case REQUEST_CLIENT:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_CLIENT:
      nextById = {...state.byId, [action.id]: { ...action.client, loaded: true }}
      return {...state, byId: nextById }
    default:
      return state
  }
}
