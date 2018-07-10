import { RECEIVE_CLIENT_NEEDS, RECEIVE_CLIENT_NEED, REQUEST_NEED,
         REMOVE_CLIENT_NEED } from '../actions/needActions.js';
import _ from 'lodash';

export function needs(state = { byId: {}, order: [], clientId: null, loaded: false }, action) {
  let nextById, nextOrder;
  switch (action.type) {
    case RECEIVE_CLIENT_NEEDS:
      nextById = _.keyBy(action.needs, need => need.id);
      nextOrder = _.map(action.needs, 'id');
      return {...state, byId: nextById, loaded: true, clientId: action.clientId, order: nextOrder}
    case RECEIVE_CLIENT_NEED:
      nextById = {...state.byId, [action.needId]: { ...action.need, loaded: true }}
      if (!_.find(state.order, action.needId)) {
        nextOrder = [action.needId, ...state.order]
        return {...state, byId: nextById, order: nextOrder }
      }
      else {
        return {...state, byId: nextById }
      }
    case REMOVE_CLIENT_NEED:
      nextById = _.clone(state.byId);
      delete nextById[action.needId]
      nextOrder = _.clone(state.order);
      _.remove(nextOrder, (id) => { return id === action.needId });
      return { ...state, byId: nextById, order: nextOrder }
    case REQUEST_NEED:
      nextById = {...state.byId, [action.needId]: { ...action.need, loaded: false }}
      return {...state, byId: nextById }
    default:
      return state
  }
}
