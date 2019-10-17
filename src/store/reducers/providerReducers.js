import _ from 'lodash';

import { RECEIVE_PROVIDER, REQUEST_PROVIDER, REQUEST_PROVIDERS, RECEIVE_PROVIDERS,
         SEARCH_PROVIDERS, REMOVE_PROVIDER } from '../actions/providerActions.js'


export function providers(state = {index: [], byId: {}, providerLoaded: false, value: '', filteredProviders: []}, action) {
  let nextIndex, nextById, providers, sortedProviders, providersByType;
  
  console.log("ProviderReducer.js - action in provider reducer 2: ", action);
  
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
      console.log("ProviderReducer.js - RECEIVE_PROVIDER state", state);
      console.log("ProviderReducer.js - RECEIVE_PROVIDER nextById", nextById);
      return {...state, byId: nextById }
    case REQUEST_PROVIDER:
      nextById = { ...state.byId, [action.id]: { providerLoaded: false } }
      return {...state, byId: nextById }
    case SEARCH_PROVIDERS:
      // for search bar
      console.log("ProviderReducer.js  - index.providers: ", state.index.providers);
      console.log("ProviderReducer.js  - action: ", action);
      
      
      //action.sortType
      if (action.sortType === '' || action.sortType === "name") {  
      
         console.log("ProviderReducer.js  - index.providers 2: ", state.index.providers);
         console.log("ProviderReducer.js  - state: ", state);
         
         sortedProviders = [...state.index].sort((a, b) => (a.profile.first_name ? a.profile.first_name.toLowerCase(): "").localeCompare(b.profile.first_name ? b.profile.first_name.toLowerCase():""));
      }
      else if (action.sortType ==='type'){
        sortedProviders = [...state.index].sort((a, b) => (a.type? a.type:"").localeCompare(b.type?b.type:""));
      }

      console.log("ProviderReducer.js  - sortedProviders: ", sortedProviders);
      
      //action.displayType 
      if (action.displayType === 'Individual' || action.displayType === 'Organization'){
        providersByType = sortedProviders.filter((provider) => ((provider.type).includes(action.displayType)));
      }
      else {
        providersByType = sortedProviders;
      }
      
      console.log("ProviderReducer.js  -  providersByType: ", providersByType);
      
      //action.searchValue
      if (action.searchValue === ''){
        return {index: providersByType, filteredProviders: providersByType, providerLoaded: true}
      }
      else if (action.searchType === 'name') {
      
        console.log("ProviderReducer.js  - state.index: ", state.index);
        console.log("ProviderReducer.js  - providersByType: ", providersByType);
        
        providers = providersByType.filter((provider) => (((provider.profile.first_name ? provider.profile.first_name.toLowerCase() : "")
         + " " + 
         (provider.profile.last_name ? provider.profile.last_name.toLowerCase():"")).includes(action.searchValue)));
        console.log("providersByType -  returned data : ", {index: [...state.index], filteredProviders: providers, providerLoaded: true});
        return {index: [...state.index], filteredProviders: providers, providerLoaded: true}
      }
      else if (action.searchType === 'email') {
        providers = providersByType.filter((providers) => ((providers.email?providers.email.toLowerCase():"").includes(action.searchValue)));
        return {index: [...state.index], filteredProviders: providers, providerLoaded: true}
      }
      else if (action.searchType === 'phone'){
        providers = providersByType.filter((providers) => ((providers.primary_phone_number?providers.primary_phone_number:"").includes(action.searchValue)));
        return {index: [...state.index], filteredProviders: providers, providerLoaded: true}
      }

    default:
      console.log("ProviderReducer.js - default branch - returned state", state);
      return state
  }
}