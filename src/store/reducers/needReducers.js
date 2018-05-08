import { RECEIVE_NEEDS, RECEIVE_NEW_CLIENT_NEED, RECEIVE_UPDATED_CLIENT_NEED, 
          REMOVE_CLIENT_NEED, RECEIVE_UPDATED_NEED_MATCH_STATE } from '../actions/needActions.js';
import _ from 'lodash';

export function needs(state = {index: {}, clientId: null, loaded: false}, action) {
  let nextIndex;
  switch (action.type) {
    case RECEIVE_NEEDS:
      return {index: action.needs, clientId: action.clientId, loaded: true};
    case RECEIVE_NEW_CLIENT_NEED:
      nextIndex = [action.need, ...state.index]
      return {...state, index: nextIndex} 
    case RECEIVE_UPDATED_CLIENT_NEED:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.needId });
      nextIndex = [action.need, ...nextIndex];
      return {...state, index: nextIndex}
    case REMOVE_CLIENT_NEED:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.needId });
      return {...state, index: nextIndex}
    case RECEIVE_UPDATED_NEED_MATCH_STATE:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      nextIndex = [action.need, ...nextIndex]
      return {...state, index: nextIndex}
    default: 
      return state
  }
}
