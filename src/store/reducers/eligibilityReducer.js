import { REQUEST_ELIGIBILITIES, RECEIVE_ELIGIBILITIES, REMOVE_ELIGIBILITY,
         REQUEST_ELIGIBILITY, RECEIVE_ELIGIBILITY } from '../actions/eligibilityActions.js';
import _ from 'lodash';

export function eligibilities(state = { eligibilitiesLoaded: false, byId: {} }, action) {
  let nextById;
  switch (action.type) {
    case REQUEST_ELIGIBILITIES:
      return { ...state, eligibilitiesLoaded: false }
    case RECEIVE_ELIGIBILITIES:
      const eligibilitysById = _.keyBy(action.eligibilities, eligibility => eligibility.id);
      return { ...state, byId: eligibilitysById, eligibilitiesLoaded: true }
    case REMOVE_ELIGIBILITY:
      nextById = _.clone(state.byId);
      delete nextById[action.id]
      return { ...state, byId: nextById }
    case REQUEST_ELIGIBILITY:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return { ...state, byId: nextById }
    case RECEIVE_ELIGIBILITY:
      nextById = {...state.byId, [action.id]: { ...action.eligibility, loaded: true }}
      return { ...state, byId: nextById }
    default:
      return state
  }
}
