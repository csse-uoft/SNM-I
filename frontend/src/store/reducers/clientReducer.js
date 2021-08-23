import { REQUEST_CLIENTS, RECEIVE_CLIENTS, REMOVE_CLIENT, REQUEST_CLIENT,
         RECEIVE_CLIENT, SEARCH_CLIENTS } from '../actions/clientActions.js';
import _ from 'lodash';


export function clients(state = {index: [], filteredClients: [], clientsLoaded: false, byId: {} }, action) {
  let nextById, clients, nextIndex, sortedClients;
  switch (action.type) {
    case REQUEST_CLIENTS:
      console.log()
      return {...state, clientsLoaded: false }
    case RECEIVE_CLIENTS:
      console.log(RECEIVE_CLIENTS);
      const newClientsById = _.keyBy(action.clients, client => client.id);
      nextById = { ...state.byId, ...newClientsById }
      return {...state, byId: nextById, clientsLoaded: true, index: action.clients, filteredClients: action.clients }
    case REMOVE_CLIENT:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return { ...state, index: nextIndex, filteredClients: nextIndex }
    case REQUEST_CLIENT:
      nextById = { ...state.byId, [action.id]: { clientsLoaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_CLIENT:
      console.log(RECEIVE_CLIENT);
      nextById = {...state.byId, [action.id]: { ...action.client, clientsLoaded: true }}
      return {...state, byId: nextById }

    case SEARCH_CLIENTS:
    // for search bar
      if (action.sortType === '' || action.sortType === "first_name") {
        console.log("client reducer :", [...state.index]);
        sortedClients = [...state.index].sort((a, b) => (a.profile.first_name ? a.profile.first_name.toLowerCase(): "").localeCompare(b.profile.first_name ? b.profile.first_name.toLowerCase():""));
      }
      else if (action.sortType === "-first_name") {
        sortedClients = [...state.index].sort((a, b) => (a.profile.first_name ? a.profile.first_name.toLowerCase(): "").localeCompare(b.profile.first_name ? b.profile.first_name.toLowerCase():""));
        sortedClients = sortedClients.reverse();
      }
      else if (action.sortType === "last_name") {
        sortedClients = [...state.index].sort((a, b) => (a.profile.last_name ? a.profile.last_name.toLowerCase(): "").localeCompare(b.profile.last_name ? b.profile.last_name.toLowerCase():""));
      }
      else if (action.sortType === "-last_name") {
        sortedClients = [...state.index].sort((a, b) => (a.profile.last_name ? a.profile.last_name.toLowerCase(): "").localeCompare(b.profile.last_name ? b.profile.last_name.toLowerCase():""));
        sortedClients = sortedClients.reverse();
      }

      if (action.searchValue === ''){
        return {index: sortedClients, filteredClients: sortedClients, clientsLoaded: true}
      }
      else if (action.searchType === 'first_name') {
        console.log("clients: ", sortedClients);
        clients = sortedClients.filter((client) => ((client.profile.first_name?client.profile.first_name.toLowerCase():"").includes(action.searchValue)));
        console.log("client reducer return: ", {index: [...state.index], filteredClients: clients, clientsLoaded: true});
        return {index: [...state.index], filteredClients: clients, clientsLoaded: true}
      }
      else if (action.searchType === 'last_name') {
        clients = sortedClients.filter((client) => ((client.profile.last_name?client.profile.last_name.toLowerCase():"").includes(action.searchValue)));
        return {index: [...state.index], filteredClients: clients, clientsLoaded: true}
      }
      else if (action.searchType === 'address') {
        clients = sortedClients.filter((client) => ((client.address?client.address.toLowerCase():"").includes(action.searchValue)));
        return {index: [...state.index], filteredClients: clients, clientsLoaded: true}
      }
      break;

    default:
      return state

  }
}
