import { RECEIVE_CLIENT_NEEDS, RECEIVE_CLIENT_NEED, REQUEST_NEED, REQUEST_NEEDS, RECEIVE_NEEDS,
         REMOVE_CLIENT_NEED, RECEIVE_CLIENT_NEED_GROUP, RECEIVE_CLIENT_NEED_INFO } from '../actions/needActions.js';
import _ from 'lodash';

export function needs(state = { byId: {}, needGroups: [], clientId: null, loaded: false, needs: [] }, action) {
  let nextById, nextNeedGroup, needGroupIndex;
  switch (action.type) {
    case REQUEST_NEEDS:
      return {...state, loaded: false }
    case RECEIVE_NEEDS:
      return {...state, needs: action.needs, loaded: true }
    case RECEIVE_CLIENT_NEEDS:
      nextById = _.keyBy(action.needs, need => need.id);
      return {...state, byId: nextById, needGroups: action.needGroups, loaded: true, clientId: action.clientId}
    case RECEIVE_CLIENT_NEED:
      nextById = {...state.byId, [action.need.id]: { ...action.need, loaded: true }}
      nextNeedGroup = _.clone(state.needGroups)
      needGroupIndex = nextNeedGroup.map(needGroup => needGroup.id).indexOf(action.needGroup.id);
      if (needGroupIndex >= 0) {
        nextNeedGroup[needGroupIndex] = action.needGroup;
      }
      else {
        nextNeedGroup = [...nextNeedGroup, action.needGroup]
      }
      return {...state, needGroups: nextNeedGroup, byId: nextById, clientId: action.clientId}
    case RECEIVE_CLIENT_NEED_INFO:
      nextById = {...state.byId, [action.needId]: { ...action.need, loaded: true }}
      nextNeedGroup = _.clone(state.needGroups)
      needGroupIndex = nextNeedGroup.map(needGroup => needGroup.id.toString()).indexOf(action.need.need_group_id);
      if (needGroupIndex >= 0) {
        const needIndex = nextNeedGroup[needGroupIndex].needs.map(need => need.id).indexOf(action.needId);
        (nextNeedGroup[needGroupIndex].needs)[needIndex] = action.need;
        return {...state, needGroups: nextNeedGroup, byId: nextById, clientId: action.clientId}
      }
      return {...state, byId: nextById, clientId: action.clientId}
    case REMOVE_CLIENT_NEED:
      const need = state.byId[action.needId];
      nextById = _.clone(state.byId);
      delete nextById[action.needId]

      nextNeedGroup = _.clone(state.needGroups);
      needGroupIndex = nextNeedGroup.map(needGroup => (needGroup.id).toString()).indexOf(need.need_group_id);
      _.remove(nextNeedGroup[needGroupIndex].needs, (need) => {return need.id === action.needId });
      if (nextNeedGroup[needGroupIndex].needs.length === 0) {
        nextNeedGroup.splice(needGroupIndex, 1);
      }
      return { ...state, byId: nextById, needGroups: nextNeedGroup }
    case REQUEST_NEED:
      nextById = {...state.byId, [action.needId]: { ...action.need, loaded: false }}
      return {...state, byId: nextById }
    case RECEIVE_CLIENT_NEED_GROUP:
      nextNeedGroup = _.clone(state.needGroups)
      needGroupIndex = nextNeedGroup.map(needGroup => needGroup.id).indexOf(action.needGroup.id);
      nextNeedGroup[needGroupIndex] = action.needGroup;
      return {...state, needGroups: nextNeedGroup }
    default:
      return state
  }
}
