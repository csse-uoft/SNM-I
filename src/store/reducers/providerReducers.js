import _ from 'lodash';

import { RECEIVE_PROVIDER, REQUEST_PROVIDER, SEARCH_PROVIDERS, REQUEST_PROVIDERS, RECEIVE_PROVIDERS,
          RECEIVE_NEW_PROVIDER, REMOVE_PROVIDER } from '../actions/providerActions.js'


export function providers(state = {index: [], byId: {}, loaded: false, value: '', filteredProviders: []}, action) {
  let nextIndex, nextById, providers, prevIndex;
  switch (action.type) {
    case REQUEST_PROVIDERS:
      return {...state, loaded: false};
    case RECEIVE_PROVIDERS:
      return {index: action.providers, filteredProviders: action.providers, loaded: true};
    case RECEIVE_NEW_PROVIDER:
      nextIndex = [action.provider, ...state.index]
      return {...state, index: nextIndex}
    case REMOVE_PROVIDER:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return {...state, index: nextIndex}
    case RECEIVE_PROVIDER: 
      nextById = {...state.byId, [action.id]: { ...action.provider, loaded: true }}
      return {...state, byId: nextById }
    case REQUEST_PROVIDER:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return {...state, byId: nextById }
    case SEARCH_PROVIDERS:
      if (action.value === '') {
        return {index: [...state.index], filteredProviders: [...state.index], loaded: true}
      }
      else {
        providers = [...state.index].filter((provider) => (provider.first_name).includes(action.value));
        return {index: [...state.index], filteredProviders: providers, loaded: true}
      }
    default:
      return state
  }
}
