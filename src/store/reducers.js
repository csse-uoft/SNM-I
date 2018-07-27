import { combineReducers } from 'redux'
import { needs } from './reducers/needReducers.js';
import { auth } from './reducers/authReducer.js';
import { users } from './reducers/userReducers.js';
import { ontology } from './reducers/ontologyReducers.js';
import { clients } from './reducers/clientReducer.js';
import { services } from './reducers/serviceReducer.js';
import { providers } from './reducers/providerReducers.js';
import { goods } from './reducers/goodReducer.js';
import { admin_logs } from './reducers/adminLogReducer.js';
import { eligibilities } from './reducers/eligibilityReducer.js';

export const rootReducer = combineReducers({
  services,
  clients,
  goods,
  needs,
  providers,
  auth,
  users,
  ontology,
  admin_logs,
  eligibilities
});
