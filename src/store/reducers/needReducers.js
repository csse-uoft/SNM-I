import { RECEIVE_CLIENT_NEEDS, RECEIVE_CLIENT_NEED, REQUEST_NEED,
         REMOVE_CLIENT_NEED } from '../actions/needActions.js';
import _ from 'lodash';

export function needs(state = { byId: {}, clientId: null, loaded: false }, action) {
  let nextById;
  switch (action.type) {
    case RECEIVE_CLIENT_NEEDS:
      nextById = _.keyBy(action.needs, need => need.id);
      return {...state, byId: nextById, loaded: true, clientId: action.clientId }
    case RECEIVE_CLIENT_NEED:
      nextById = {...state.byId, [action.needId]: { ...action.need, loaded: true }}
      return {...state, byId: nextById }
    case REMOVE_CLIENT_NEED:
      nextById = _.clone(state.byId);
      delete nextById[action.needId]
      return { ...state, byId: nextById }
    case REQUEST_NEED:
      nextById = {...state.byId, [action.needId]: { ...action.need, loaded: false }}
      return {...state, byId: nextById }
    default:
      return state
  }
}
