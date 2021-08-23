import { combineReducers } from 'redux'
import { needs } from './reducers/needReducers.js';
import { auth } from './reducers/authReducer.js';
import { ontology } from './reducers/ontologyReducers.js';
import { clients } from './reducers/clientReducer.js';
import { services } from './reducers/serviceReducer.js';
import { providers } from './reducers/providerReducers.js';
import { goods } from './reducers/goodReducer.js';


const appReducer = combineReducers({
  services,
  clients,
  goods,
  needs,
  providers,
  auth,
  ontology,
});

const initialState = appReducer({}, {});

export const rootReducer = (state, action) => {
  if (action.type === 'LOGGED_OUT') {
    state = initialState
  }

  return appReducer(state, action);
};
