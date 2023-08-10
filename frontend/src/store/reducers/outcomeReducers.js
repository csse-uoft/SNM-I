import { RECEIVE_CLIENT_OUTCOMES, RECEIVE_CLIENT_OUTCOME, REQUEST_OUTCOME, REQUEST_OUTCOMES, RECEIVE_OUTCOMES,
         REMOVE_CLIENT_OUTCOME, RECEIVE_CLIENT_OUTCOME_GROUP, RECEIVE_CLIENT_OUTCOME_INFO } from '../actions/outcomeActions.js';
import _ from 'lodash';

export function outcomes(state = { byId: {}, outcomeGroups: [], clientId: null, loaded: false, outcomes: [] }, action) {
  let nextById, nextOutcomeGroup, outcomeGroupIndex;
  switch (action.type) {
    case REQUEST_OUTCOMES:
      return {...state, loaded: false }
    case RECEIVE_OUTCOMES:
      return {...state, outcomes: action.outcomes, loaded: true }
    case RECEIVE_CLIENT_OUTCOMES:
      if (action.outcomes){
        nextById = _.keyBy(action.outcomes, outcome => outcome.id);
        return {...state, byId: nextById, outcomeGroups: action.outcomeGroups, loaded: true, clientId: action.clientId}
      } else {
        return {...state, outcomeGroups: action.outcomeGroups, loaded: true, clientId: action.clientId}
      }
    case RECEIVE_CLIENT_OUTCOME:
      nextById = {...state.byId, [action.outcome.id]: { ...action.outcome, loaded: true }}
      nextOutcomeGroup = _.clone(state.outcomeGroups)
      outcomeGroupIndex = nextOutcomeGroup.map(outcomeGroup => outcomeGroup.id).indexOf(action.outcomeGroup.id);
      if (outcomeGroupIndex >= 0) {
        nextOutcomeGroup[outcomeGroupIndex] = action.outcomeGroup;
      }
      else {
        nextOutcomeGroup = [...nextOutcomeGroup, action.outcomeGroup]
      }
      return {...state, outcomeGroups: nextOutcomeGroup, byId: nextById, clientId: action.clientId}
    case RECEIVE_CLIENT_OUTCOME_INFO:
      nextById = {...state.byId, [action.outcomeId]: { ...action.outcome, loaded: true }}
      nextOutcomeGroup = _.clone(state.outcomeGroups)
      outcomeGroupIndex = nextOutcomeGroup.map(outcomeGroup => outcomeGroup.id.toString()).indexOf(action.outcome.outcome_group_id);
      if (outcomeGroupIndex >= 0) {
        const outcomeIndex = nextOutcomeGroup[outcomeGroupIndex].outcomes.map(outcome => outcome.id).indexOf(action.outcomeId);
        (nextOutcomeGroup[outcomeGroupIndex].outcomes)[outcomeIndex] = action.outcome;
        return {...state, outcomeGroups: nextOutcomeGroup, byId: nextById, clientId: action.clientId}
      }
      return {...state, byId: nextById, clientId: action.clientId}
    case REMOVE_CLIENT_OUTCOME:
      const outcome = state.byId[action.outcomeId];
      nextById = _.clone(state.byId);
      delete nextById[action.outcomeId]

      nextOutcomeGroup = _.clone(state.outcomeGroups);
      outcomeGroupIndex = nextOutcomeGroup.map(outcomeGroup => (outcomeGroup.id).toString()).indexOf(outcome.outcome_group_id);
      _.remove(nextOutcomeGroup[outcomeGroupIndex].outcomes, (outcome) => {return outcome.id === action.outcomeId });
      if (nextOutcomeGroup[outcomeGroupIndex].outcomes.length === 0) {
        nextOutcomeGroup.splice(outcomeGroupIndex, 1);
      }
      return { ...state, byId: nextById, outcomeGroups: nextOutcomeGroup }
    case REQUEST_OUTCOME:
      nextById = {...state.byId, [action.outcomeId]: { ...action.outcome, loaded: false }}
      return {...state, byId: nextById }
    case RECEIVE_CLIENT_OUTCOME_GROUP:
      nextOutcomeGroup = _.clone(state.outcomeGroups)
      outcomeGroupIndex = nextOutcomeGroup.map(outcomeGroup => outcomeGroup.id).indexOf(action.outcomeGroup.id);
      nextOutcomeGroup[outcomeGroupIndex] = action.outcomeGroup;
      return {...state, outcomeGroups: nextOutcomeGroup }
    default:
      return state
  }
}
