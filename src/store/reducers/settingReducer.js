import _ from 'lodash';
import { RECEIVE_CLIENT_FIELDS } from '../actions/settingActions.js';

const DEFAULT_STATE = {
  formStructure: {},
  clientIndexFields: [],
  stepsOrder: []
}

export function settings(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case RECEIVE_CLIENT_FIELDS:
      return { clientIndexFields: action.indexFields || DEFAULT_STATE['clientIndexFields'],
               formStructure: action.formStructure || DEFAULT_STATE['formStructure'],
               stepsOrder: action.stepsOrder || DEFAULT_STATE['stepsOrder'] }

    default:
      return state
  }
}
