import { REQUEST_ADMIN_LOGS, RECEIVE_ADMIN_LOGS } from '../actions/adminLogActions.js';
import _ from 'lodash';


export function admin_logs(state = { logsLoaded: false, byId: {} }, action) {
  switch (action.type) {
    case REQUEST_ADMIN_LOGS:
      return { ...state, logsLoaded: false }
    case RECEIVE_ADMIN_LOGS:
      const nextById = _.keyBy(action.logs, log => log.id);
      return { ...state, byId: nextById, logsLoaded: true }
    default:
      return state
  }
}
