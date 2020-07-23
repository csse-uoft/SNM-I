import { REQUEST_SERVICES, RECEIVE_SERVICES, SEARCH_SERVICES, REMOVE_SERVICE,
         REQUEST_SERVICE, RECEIVE_SERVICE } from '../actions/serviceActions.js';
import _ from 'lodash';


export function services(state = {index: [], filteredServices: [], servicesLoaded: false, byId: {} }, action) {
  let nextById, sortedServices, services, nextIndex;
  switch (action.type) {
    case REQUEST_SERVICES:
    // should be for fetching all serves in componentWillMount
      return {...state, servicesLoaded: false }
    case RECEIVE_SERVICES:
      console.log("reducer check: ", action);
    // should be for fetching all serves in componentWillMount
      const newServicesById = _.keyBy(action.services, service => service.id);
      nextById = { ...state.byId, ...newServicesById }
      return {...state, byId: nextById, servicesLoaded: true, index: action.services, filteredServices:action.services }
    case REMOVE_SERVICE:
    // should be for delete function
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return { ...state, index: nextIndex, filteredServices: nextIndex }
    case REQUEST_SERVICE:
    // for single servce viewing
      nextById = { ...state.byId, [action.id]: { servicesLoaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_SERVICE:
    // same as above
      nextById = {...state.byId, [action.id]: { ...action.service, servicesLoaded: true }}
      return {...state, byId: nextById }

    case SEARCH_SERVICES:
    // for search bar
      if (action.sortType === '' || action.sortType === "name") {
        console.log("service reducer :", [...state.index]);
        sortedServices = [...state.index].sort((a, b) => (a.name ? a.name.toLowerCase(): "").localeCompare(b.name ? b.name.toLowerCase():""));
      }
      else if (action.sortType === "provider") {
        sortedServices = [...state.index].sort((a, b) => (a.provider.profile.first_name?a.provider.profile.first_name.toLowerCase():"").localeCompare(b.provider.profile.first_name?b.provider.profile.first_name.toLowerCase():""));
      }
      else if (action.sortType === "description") {
        sortedServices = [...state.index].sort((a, b) => (a.desc?a.desc:"").localeCompare(b.desc?b.desc:""));
      }
      else if (action.sortType === "category") {
        sortedServices = [...state.index].sort((a, b) => (a.category? a.category:"").localeCompare(b.category?b.category:""));
      }

      if (action.searchValue === '') {
        return {index: sortedServices, filteredServices: sortedServices, servicesLoaded: true}
      }
      else if (action.searchType === "name") {
        services = sortedServices.filter((service) => ((service.name?service.name.toLowerCase():"").includes(action.searchValue) ));
        console.log("service reducer return: ", {index: [...state.index], filteredServices: services, servicesLoaded: true});
        return {index: [...state.index], filteredServices: services, servicesLoaded: true}
      }
      else if (action.searchType === "provider") {
        services = sortedServices.filter((service) => (service.provider.company ? (service.provider.company).includes(action.searchValue) : "")
        || ((service.provider.profile.first_name ? service.provider.profile.first_name.toLowerCase() : "")
         + " " +
         (service.provider.profile.last_name ? service.provider.profile.last_name.toLowerCase().includes(action.searchValue): "")));
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
      break;
    default:
      return state
  }
}
