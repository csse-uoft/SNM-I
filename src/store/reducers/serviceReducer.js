import { REQUEST_SERVICES, RECEIVE_SERVICES, REMOVE_SERVICE,
         REQUEST_SERVICE, RECEIVE_SERVICE } from '../actions/serviceActions.js';
import _ from 'lodash';


export function services(state = { servicesLoaded: false, byId: {} }, action) {
  let nextById;
  switch (action.type) {
    case REQUEST_SERVICES:
      return {...state, servicesLoaded: false }
    case RECEIVE_SERVICES:
      nextById = _.keyBy(action.services, service => service.id);
      return {...state, byId: nextById, servicesLoaded: true }
    case REMOVE_SERVICE:
      nextById = _.clone(state.byId);
      delete nextById[action.id]
      return { ...state, byId: nextById }
    case REQUEST_SERVICE:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_SERVICE:
      nextById = {...state.byId, [action.id]: { ...action.service, loaded: true }}
      return {...state, byId: nextById }
    default:
      return state
  }
}
