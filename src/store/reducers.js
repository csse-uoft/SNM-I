import { combineReducers } from 'redux'
import { SEARCH_REQUESTED, SEARCH_RESPONSE_RECEIVED, REQUEST_CLIENT, 
          RECEIVE_CLIENT, REQUEST_CLIENTS, RECEIVE_CLIENTS,
          REQUEST_DASHBOARD_CLIENT_DATA, RECEIEVE_DASHBOARD_CLIENT_DATA,
          RECEIVE_NEW_CLIENT, REQUEST_RESOURCES, RECEIVE_RESOURCES,
          RECEIVE_NEW_RESOURCE, REQUEST_PROVIDERS, RECEIVE_PROVIDERS, 
          RECEIVE_NEW_PROVIDER, REMOVE_CLIENT, REMOVE_PROVIDER,
          REMOVE_RESOURCE, RECEIVE_NEW_GOOD, REQUEST_GOODS, RECEIVE_GOODS, REMOVE_GOODS} from './actions.js'
import { needs } from './reducers/needReducers.js';
import { auth } from './reducers/authReducer.js';
import _ from 'lodash';

function searchResultsByNeedId(state = {}, action) {
  let nextResultObj;
  switch (action.type) {
    case SEARCH_REQUESTED:
      nextResultObj = {...state[action.needId], loaded: false};
      return {...state, [action.needId]: nextResultObj};
    case SEARCH_RESPONSE_RECEIVED:
      nextResultObj = {...state[action.needId], result: action.providers, loaded: true};
      return {...state, [action.needId]: nextResultObj}
    default:
      return state
  }
}

function clients(state = {index: [], indexLoaded: false, byId: {}, dashboard: {index: [], loaded: false} }, action) {
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
    case REQUEST_DASHBOARD_CLIENT_DATA:
      return {...state, dashboard: {index: [], loaded: false}}
    case RECEIEVE_DASHBOARD_CLIENT_DATA:
      return {...state, dashboard: { index: action.clients, loaded: true } }   
    default:
      return state
  }
}

function resources(state = {index: [], loaded: false}, action) {
  let nextIndex;
  switch (action.type) {
    case REQUEST_RESOURCES:
      return {...state, loaded: false};
    case RECEIVE_RESOURCES:
      return {index: action.resources, loaded: true}
    case REMOVE_RESOURCE:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return {...state, index: nextIndex}
    case RECEIVE_NEW_RESOURCE:
      nextIndex = [action.resource, ...state.index]
      return {...state, index: nextIndex}
    default:
      return state
  }
}

function goods(state = {index: [], loaded: false}, action) {
  let nextIndex;
  switch (action.type) {
    case REQUEST_GOODS:
      return {...state, loaded: false};
    case RECEIVE_GOODS:
      return {index: action.goods, loaded: true}
    case REMOVE_GOODS:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return {...state, index: nextIndex}
    case RECEIVE_NEW_GOOD:
      nextIndex = [action.good, ...state.index]
      return {...state, index: nextIndex}
    default:
      return state
  }
}



function providers(state = {index: [], loaded: false}, action) {
  let nextIndex;
  switch (action.type) {
    case REQUEST_PROVIDERS:
      return {...state, loaded: false};
    case RECEIVE_PROVIDERS:
      return {index: action.providers, loaded: true}
    case RECEIVE_NEW_PROVIDER:
      nextIndex = [action.provider, ...state.index]
      return {...state, index: nextIndex}
    case REMOVE_PROVIDER:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return {...state, index: nextIndex}
    default:
      return state
  }
}


export const rootReducer = combineReducers({
  searchResultsByNeedId,
  clients,
  goods,
  needs,
  resources,
  providers,
  auth
});
