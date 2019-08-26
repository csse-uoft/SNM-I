import { REQUEST_CLIENTS, RECEIVE_CLIENTS, REMOVE_CLIENT, REQUEST_CLIENT, 
         RECEIVE_CLIENT, SEARCH_CLIENTS } from '../actions/clientActions.js';
import _ from 'lodash';


export function clients(state = {index: [], filteredClients: [], clientsLoaded: false, byId: {} }, action) {
  let nextById, clients, nextIndex, sortedClients;
  switch (action.type) {
    case REQUEST_CLIENTS:
      return {...state, clientsLoaded: false }
    case RECEIVE_CLIENTS:
      const newClientsById = _.keyBy(action.clients, client => client.id);
      nextById = { ...state.byId, ...newClientsById }
      console.log("reducer check: ", action);
      return {...state, byId: nextById, clientsLoaded: true, index: action.clients, filteredClients: action.clients }
    case REMOVE_CLIENT:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return { ...state, index: nextIndex, filteredClients: nextIndex }
    case REQUEST_CLIENT:
      nextById = { ...state.byId, [action.id]: { clientsLoaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_CLIENT:
      nextById = {...state.byId, [action.id]: { ...action.client, clientsLoaded: true }}
      return {...state, byId: nextById }

    case SEARCH_CLIENTS:
    // for search bar
      if (action.sortType === '' || action.sortType === "first_name") {
        console.log("client reducer :", [...state.index]);
        sortedClients = [...state.index].sort((a, b) => (a.first_name ? a.first_name.toLowerCase(): "").localeCompare(b.first_name ? b.first_name.toLowerCase():""));
      }
      else if (action.sortType === "-first_name") {
        sortedClients = [...state.index].sort((a, b) => (a.first_name ? a.first_name.toLowerCase(): "").localeCompare(b.first_name ? b.first_name.toLowerCase():""));
        sortedClients = sortedClients.reverse();
      }
      else if (action.sortType === "last_name") {
        sortedClients = [...state.index].sort((a, b) => (a.last_name ? a.last_name.toLowerCase(): "").localeCompare(b.last_name ? b.last_name.toLowerCase():""));
      }
      else if (action.sortType === "-last_name") {
        sortedClients = [...state.index].sort((a, b) => (a.last_name ? a.last_name.toLowerCase(): "").localeCompare(b.last_name ? b.last_name.toLowerCase():""));
        sortedClients = sortedClients.reverse();        
      }
      
      if (action.searchValue === ''){
        return {index: sortedClients, filteredClients: sortedClients, clientsLoaded: true}
      }
      else if (action.searchValue === 'first_name') {
        clients = sortedClients.filter((client) => ((client.first_name?client.first_name.toLowerCase():"").inclides(action.searchValue)));
        return {index: [...state.index], filteredClients: clients, clientsLoaded: true}
      }
      else if (action.searchValue === 'last_name') {
        clients = sortedClients.filter((client) => ((client.last_name?client.last_name.toLowerCase():"").inclides(action.searchValue)));
        return {index: [...state.index], filteredClients: clients, clientsLoaded: true}
      }
      else if (action.searchValue === 'address') {
        clients = sortedClients.filter((client) => ((client.address?client.address.toLowerCase():"").inclides(action.searchValue)));
        return {index: [...state.index], filteredClients: clients, clientsLoaded: true}
      }

    default:
      return state
      
  }
}