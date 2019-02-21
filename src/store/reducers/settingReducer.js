import { RECEIVE_CLIENT_FIELDS, RECEIVE_PROVIDER_FIELDS } from '../actions/settingActions.js';

const DEFAULT_STATE = {
  clients: {
    formStructure: {},
    indexFields: [],
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
          indexFields: action.indexFields || DEFAULT_STATE['clients']['indexFields'],
          formStructure: action.formStructure || DEFAULT_STATE['clients']['formStructure'],
          stepsOrder: action.stepsOrder || DEFAULT_STATE['clients']['stepsOrder']
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
