import { combineReducers } from 'redux'
import { needs } from './reducers/needReducers.js';
import { ontology } from './reducers/ontologyReducers.js';
import { clients } from './reducers/clientReducer.js';
import { services } from './reducers/serviceReducer.js';
import { programs } from './reducers/programReducer.js';
import { providers } from './reducers/providerReducers.js';


const appReducer = combineReducers({
  services,
  programs,
  clients,
  needs,
  providers,
  ontology,
});

const initialState = appReducer({}, {});

export const rootReducer = (state, action) => {
  if (action.type === 'LOGGED_OUT') {
    state = initialState
  }

  return appReducer(state, action);
};
