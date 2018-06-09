import { REQUEST_GOODS, RECEIVE_GOODS, SEARCH_GOODS, REMOVE_GOOD,
         REQUEST_GOOD, RECEIVE_GOOD } from '../actions/goodActions.js';
import _ from 'lodash';


export function goods(state = {index: [], filteredGoods: [], goodsLoaded: false, byId: {} }, action) {
  let nextIndex, nextById, goods;
  switch (action.type) {
    case REQUEST_GOODS:
      return {...state, goodsLoaded: false }
    case RECEIVE_GOODS:
      nextById = _.keyBy(action.goods, good => good.id);
      return {...state, byId: nextById, goodsLoaded: true, index: action.goods, filteredGoods:action.goods }
    case REMOVE_GOOD:
      nextById = _.clone(state.byId);
      delete nextById[action.id]
      return { ...state, byId: nextById }
    case REQUEST_GOOD:
      nextById = { ...state.byId, [action.id]: { goodsLoaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_GOOD:
      nextById = {...state.byId, [action.id]: { ...action.good, goodsLoaded: true }}
      return {...state, byId: nextById }
    case SEARCH_GOODS:
      if (action.searchValue === '') {
        return {index: [...state.index], filteredGoods: [...state.index], goodsLoaded: true}
      }
      else if (action.searchType === "name") {
        goods = [...state.index].filter((good) => ((good.name).includes(action.searchValue) ));
        return {index: [...state.index], filteredGoods: goods, goodsLoaded: true}
      }
      else if (action.searchType === "email") {
        goods = [...state.index].filter((good) => (good.email).includes(action.searchValue));
        return {index: [...state.index], filteredGoods: goods, goodsLoaded: true}
      }
    default:
      return state
  }
}
