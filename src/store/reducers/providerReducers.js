import _ from 'lodash';

import { RECEIVE_PROVIDER, REQUEST_PROVIDER, REQUEST_PROVIDERS, RECEIVE_PROVIDERS,
         SEARCH_PROVIDERS, REMOVE_PROVIDER } from '../actions/providerActions.js'


export function providers(state = {index: [], byId: {}, providerLoaded: false, value: '', filteredProviders: []}, action) {
  let nextIndex, nextById, providers, sortedProviders, providersByType;
  console.log("action in provider reducer: ", action);
  switch (action.type) {
    case REQUEST_PROVIDERS:
      return {...state, providerLoaded: false};
    case RECEIVE_PROVIDERS:
      const providersById = _.keyBy(action.providers, provider => provider.id);
      nextById = {...state.byId, providersById}
      return {...state, byId: nextById, index: action.providers, filteredProviders: action.providers, providerLoaded: true};
    case REMOVE_PROVIDER:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return {...state, index: nextIndex, filteredProviders: nextIndex}
    case RECEIVE_PROVIDER:
      nextById = {...state.byId, [action.id]: { ...action.provider, providerLoaded: true }}
      return {...state, byId: nextById }
    case REQUEST_PROVIDER:
      nextById = { ...state.byId, [action.id]: { providerLoaded: false } }
      return {...state, byId: nextById }

    case SEARCH_PROVIDERS:
    // for search bar
      console.log("index: ", state.index)
      console.log("action: ", action);
      if (action.sortType === '' || action.sortType === "name") {
        sortedProviders = [...state.index].sort((a, b) => (a.profile.first_name ? a.profile.first_name.toLowerCase(): "").localeCompare(b.profile.first_name ? b.profile.first_name.toLowerCase():""));
      }
      else if (action.sortType ==='type'){
        sortedProviders = [...state.index].sort((a, b) => (a.type? a.type:"").localeCompare(b.type?b.type:""));
      }

      console.log("sortedProviders: ", sortedProviders);

      if (action.displayType === 'Individual' || action.displayType === 'Organization'){
        providersByType = sortedProviders.filter((provider) => ((provider.type).includes(action.displayType)));
      }
      else {
        providersByType = sortedProviders;
      }
      
      console.log("-------------_> providersByType: ", providersByType);
      if (action.searchValue === ''){
        return {index: sortedProviders, filteredProviders: providersByType, providerLoaded: true}
      }
      else if (action.searchType === 'name') {
        console.log("providers: ", providersByType);
        providers = providersByType?providersByType.filter((provider) => ((provider.profile.first_name ? provider.profile.first_name.toLowerCase() : "")
         + " " + 
         (provider.profile.last_name ? provider.profile.last_name.toLowerCase().includes(action.searchValue): ""))):[];
        console.log("providers reducer return: ", {index: [...state.index], filteredProviders: providers, providerLoaded: true});
        return {index: [...state.index], filteredProviders: providers, providerLoaded: true}
      }
      else if (action.searchType === 'email') {
        providers = providersByType?providersByType.filter((providers) => ((providers.email?providers.email.toLowerCase():"").includes(action.searchValue))):[];
        return {index: [...state.index], filteredProviders: providers, providerLoaded: true}
      }
      else if (action.searchType === 'phone'){
        providers = providersByType?providersByType.filter((providers) => ((providers.primary_phone_number?providers.primary_phone_number:"").includes(action.searchValue))):[];
        return {index: [...state.index], filteredProviders: providers, providerLoaded: true}
      }

    default:
      return state
  }
}