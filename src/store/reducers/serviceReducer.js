import { REQUEST_SERVICES, RECEIVE_SERVICES, SEARCH_SERVICES, REMOVE_SERVICE,
         REQUEST_SERVICE, RECEIVE_SERVICE, RECEIVE_ALL_SERVICES } from '../actions/serviceActions.js';
import _ from 'lodash';


export function services(state = {index: [], filteredServices: [], servicesLoaded: false, byId: {} }, action) {
  let nextById, sortedServices, services;
  switch (action.type) {
    case REQUEST_SERVICES:
      return {...state, servicesLoaded: false }
    case RECEIVE_SERVICES:
      const newServicesById = _.keyBy(action.services, service => service.id);
      nextById = { ...state.byId, ...newServicesById }
      return {...state, byId: nextById, servicesLoaded: true, index: action.services, filteredServices:action.services }
    case RECEIVE_ALL_SERVICES:
      nextById = _.keyBy(action.services, service => service.id);
      return {...state, byId: nextById, servicesLoaded: true, index: action.services, filteredServices:action.services }
    case REMOVE_SERVICE:
      nextById = _.clone(state.byId);
      delete nextById[action.id]
      return { ...state, byId: nextById }
    case REQUEST_SERVICE:
      nextById = { ...state.byId, [action.id]: { servicesLoaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_SERVICE:
      nextById = {...state.byId, [action.id]: { ...action.service, servicesLoaded: true }}
      return {...state, byId: nextById }
    case SEARCH_SERVICES:

      if (action.sortType === '') {
        sortedServices = [...state.index];
      }
      else if (action.sortType === "name") {
        sortedServices = [...state.index].sort((a, b) => (a.name).localeCompare(b.name));
      }
      else if (action.sortType === "provider") {
        sortedServices = [...state.index].sort((a, b) => (a.provider.first_name).localeCompare(b.provider.first_name));
      }
      else if (action.sortType === "description") {
        sortedServices = [...state.index].sort((a, b) => (a.desc).localeCompare(b.desc));
      }
      else if (action.sortType === "category") {
        sortedServices = [...state.index].sort((a, b) => (a.category).localeCompare(b.category));
      }
      
      if (action.searchValue === '') {
        return {index: sortedServices, filteredServices: sortedServices, servicesLoaded: true}
      }
      else if (action.searchType === "name") {
        services = sortedServices.filter((service) => ((service.name).includes(action.searchValue) ));
        return {index: [...state.index], filteredServices: services, servicesLoaded: true}
      }
      else if (action.searchType === "provider") {
        services = sortedServices.filter((service) => ((service.provider.company).includes(action.searchValue)) || ((service.provider.first_name + " " + service.provider.last_name).includes(action.searchValue)));
        return {index: [...state.index], filteredServices: services, servicesLoaded: true}
      }
      else if (action.searchType === "description") {
        services = sortedServices.filter((service) => ((service.desc).includes(action.searchValue) ));
        return {index: [...state.index], filteredServices: services, servicesLoaded: true}
      }
      else if (action.searchType === "category") {
        services = sortedServices.filter((service) => ((service.category).includes(action.searchValue) ));
        return {index: [...state.index], filteredServices: services, servicesLoaded: true}
      } 

    default:
      return state
  }
}
