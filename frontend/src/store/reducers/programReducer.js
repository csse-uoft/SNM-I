import { REQUEST_PROGRAMS, RECEIVE_PROGRAMS, SEARCH_PROGRAMS, REMOVE_PROGRAM,
         REQUEST_PROGRAM, RECEIVE_PROGRAM } from '../actions/programActions.js';
import _ from 'lodash';


export function programs(state = {index: [], filteredPrograms: [], programsLoaded: false, byId: {} }, action) {
  let nextById, sortedPrograms, programs, nextIndex;
  switch (action.type) {
    case REQUEST_PROGRAMS:
    // should be for fetching all serves in componentWillMount
      return {...state, programsLoaded: false }
    case RECEIVE_PROGRAMS:
      console.log("reducer check: ", action);
    // should be for fetching all serves in componentWillMount
      const newProgramsById = _.keyBy(action.programs, program => program.id);
      nextById = { ...state.byId, ...newProgramsById }
      return {...state, byId: nextById, programsLoaded: true, index: action.programs, filteredPrograms:action.programs }
    case REMOVE_PROGRAM:
    // should be for delete function
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return { ...state, index: nextIndex, filteredPrograms: nextIndex }
    case REQUEST_PROGRAM:
    // for single servce viewing
      nextById = { ...state.byId, [action.id]: { programsLoaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_PROGRAM:
    // same as above
      nextById = {...state.byId, [action.id]: { ...action.program, programsLoaded: true }}
      return {...state, byId: nextById }

    case SEARCH_PROGRAMS:
    // for search bar
      if (action.sortType === '' || action.sortType === "name") {
        console.log("program reducer :", [...state.index]);
        sortedPrograms = [...state.index].sort((a, b) => (a.name ? a.name.toLowerCase(): "").localeCompare(b.name ? b.name.toLowerCase():""));
      }
      else if (action.sortType === "provider") {
        sortedPrograms = [...state.index].sort((a, b) => (a.provider.profile.first_name?a.provider.profile.first_name.toLowerCase():"").localeCompare(b.provider.profile.first_name?b.provider.profile.first_name.toLowerCase():""));
      }
      else if (action.sortType === "description") {
        sortedPrograms = [...state.index].sort((a, b) => (a.desc?a.desc:"").localeCompare(b.desc?b.desc:""));
      }
      else if (action.sortType === "category") {
        sortedPrograms = [...state.index].sort((a, b) => (a.category? a.category:"").localeCompare(b.category?b.category:""));
      }

      if (action.searchValue === '') {
        return {index: sortedPrograms, filteredPrograms: sortedPrograms, programsLoaded: true}
      }
      else if (action.searchType === "name") {
        programs = sortedPrograms.filter((program) => ((program.name?program.name.toLowerCase():"").includes(action.searchValue) ));
        console.log("program reducer return: ", {index: [...state.index], filteredPrograms: programs, programsLoaded: true});
        return {index: [...state.index], filteredPrograms: programs, programsLoaded: true}
      }
      else if (action.searchType === "provider") {
        programs = sortedPrograms.filter((program) => (program.provider.company ? (program.provider.company).includes(action.searchValue) : "")
        || ((program.provider.profile.first_name ? program.provider.profile.first_name.toLowerCase() : "")
         + " " +
         (program.provider.profile.last_name ? program.provider.profile.last_name.toLowerCase().includes(action.searchValue): "")));
        return {index: [...state.index], filteredPrograms: programs, programsLoaded: true}
      }
      else if (action.searchType === "description") {
        programs = sortedPrograms.filter((program) => ((program.desc).includes(action.searchValue) ));
        return {index: [...state.index], filteredPrograms: programs, programsLoaded: true}
      }
      else if (action.searchType === "category") {
        programs = sortedPrograms.filter((program) => ((program.category).includes(action.searchValue) ));
        return {index: [...state.index], filteredPrograms: programs, programsLoaded: true}
      }
      break;
    default:
      return state
  }
}
