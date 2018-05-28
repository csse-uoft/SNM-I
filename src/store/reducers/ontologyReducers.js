import { RECEIVE_CATEGORIES } from '../actions/ontologyActions.js';
import _ from 'lodash';

const DEFAULT_CATEGORY_STATE = { categories: [], loaded: false }

export function ontology(state = { needs: DEFAULT_CATEGORY_STATE,
                                   services: DEFAULT_CATEGORY_STATE,
                                   languages: DEFAULT_CATEGORY_STATE },
                         action) {
  switch (action.type) {
    case RECEIVE_CATEGORIES:
      return {...state, [action.category_type]: { categories: action.categories, loaded: true } }
    default:
      return state
  }
}
