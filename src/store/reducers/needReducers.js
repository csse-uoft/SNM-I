import { RECEIVE_CLIENT_NEEDS, RECEIVE_CLIENT_NEED, REQUEST_NEED,
         REMOVE_CLIENT_NEED, RECEIVE_CLIENT_NEED_GROUP } from '../actions/needActions.js';
import _ from 'lodash';

export function needs(state = { byId: {}, order: [], needGroups: [], clientId: null, loaded: false }, action) {
  let nextById, nextOrder, nextNeedGroup, needGroupIndex;
  switch (action.type) {
    case RECEIVE_CLIENT_NEEDS:
      nextById = _.keyBy(action.needs, need => need.id);
      nextOrder = _.map(action.needs, 'id');
      return {...state, byId: nextById, needGroups: action.needGroups, loaded: true, clientId: action.clientId, order: nextOrder}
    case RECEIVE_CLIENT_NEED:
      nextById = {...state.byId, [action.needId]: { ...action.need, loaded: true }}
      nextNeedGroup = _.clone(state.needGroups)
      needGroupIndex = nextNeedGroup.map(needGroup => needGroup.id).indexOf(action.need.need_group_id);
      if (needGroupIndex >= 0) {
        const needIndex = nextNeedGroup[needGroupIndex].needs.map(need => need.id).indexOf(action.need.id);
        (nextNeedGroup[needGroupIndex].needs)[needIndex] = action.need;
      }
      if (!_.includes(state.order, action.needId)) {
        nextOrder = [action.needId, ...state.order]
        return {...state, byId: nextById, order: nextOrder, needGroups: nextNeedGroup }
      }
      else {
        return {...state, byId: nextById, needGroups: nextNeedGroup }
      }
    case REMOVE_CLIENT_NEED:
      const need = state.byId[action.needId];
      nextById = _.clone(state.byId);
      delete nextById[action.needId]
      nextOrder = _.clone(state.order);
      _.remove(nextOrder, (id) => { return id === action.needId });
      nextNeedGroup = _.clone(state.needGroups);
      needGroupIndex = nextNeedGroup.map(needGroup => needGroup.id.toString()).indexOf(need.need_group_id);
      _.remove(nextNeedGroup[needGroupIndex].needs, (id) => {return id === action.needId });
      if (nextNeedGroup[needGroupIndex].needs.length === 0) {
        nextNeedGroup.splice(needGroupIndex, 1);
      }
      return { ...state, byId: nextById, order: nextOrder, needGroups: nextNeedGroup }
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
