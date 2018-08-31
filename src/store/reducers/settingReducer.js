import _ from 'lodash';
import { RECEIVE_CLIENT_FIELDS, RECEIVE_PROVIDER_FIELDS } from '../actions/settingActions.js';

const DEFAULT_STATE = {
  clients: {
    formStructure: {},
    clientIndexFields: [],
    stepsOrder: []
  },
  providers: {}
}

export function settings(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case RECEIVE_CLIENT_FIELDS:
      return {
        ...state,
        clients: {
          clientIndexFields: action.indexFields || DEFAULT_STATE['clientIndexFields'],
          formStructure: action.formStructure || DEFAULT_STATE['formStructure'],
          stepsOrder: action.stepsOrder || DEFAULT_STATE['stepsOrder']
        }
      }
    case RECEIVE_PROVIDER_FIELDS:
      return {
        ...state,
        providers: action.json
      }
    default:
      return state
  }
}
