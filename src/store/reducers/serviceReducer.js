import { REQUEST_SERVICES, RECEIVE_SERVICES, SEARCH_SERVICES, REMOVE_SERVICE,
         REQUEST_SERVICE, RECEIVE_SERVICE, RECEIVE_ALL_SERVICES } from '../actions/serviceActions.js';
import _ from 'lodash';


export function services(state = {index: [], filteredServices: [], servicesLoaded: false, byId: {} }, action) {
  let nextIndex, nextById, services;
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
      if (action.searchValue === '') {
        return {index: [...state.index], filteredServices: [...state.index], servicesLoaded: true}
      }
      else if (action.searchType === "name") {
        services = [...state.index].filter((service) => ((service.name).includes(action.searchValue) ));
        return {index: [...state.index], filteredServices: services, servicesLoaded: true}
      }
      else if (action.searchType === "email") {
        services = [...state.index].filter((service) => (service.email).includes(action.searchValue));
        return {index: [...state.index], filteredServices: services, servicesLoaded: true}
      }
    default:
      return state
  }
}
