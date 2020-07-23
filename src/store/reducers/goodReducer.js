import { REQUEST_GOODS, RECEIVE_GOODS, RECEIVE_ALL_GOODS, SEARCH_GOODS, REMOVE_GOOD,
         REQUEST_GOOD, RECEIVE_GOOD } from '../actions/goodActions.js';
import _ from 'lodash';


export function goods(state = {index: [], filteredGoods: [], goodsLoaded: false, byId: {} }, action) {
  let nextById, sortedGoods, goods;
  switch (action.type) {
    case REQUEST_GOODS:
      return {...state, goodsLoaded: false }
    case RECEIVE_GOODS:
      const newGoodsById = _.keyBy(action.goods, good => good.id);
      nextById = { ...state.byId, ...newGoodsById }
      return {...state, byId: nextById, goodsLoaded: true, index: action.goods, filteredGoods:action.goods }
    case RECEIVE_ALL_GOODS:
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
      if (action.sortType === '') {
        sortedGoods = [...state.index];
      }
      else if (action.sortType === "name") {
        sortedGoods = [...state.index].sort((a, b) => (a.name).localeCompare(b.name));
      }
      else if (action.sortType === "provider") {
        sortedGoods = [...state.index].sort((a, b) => (a.provider.profile.first_name).localeCompare(b.provider.profile.first_name));
      }
      else if (action.sortType === "description") {
        sortedGoods = [...state.index].sort((a, b) => (a.desc).localeCompare(b.desc));
      }
      else if (action.sortType === "category") {
        sortedGoods = [...state.index].sort((a, b) => (a.category).localeCompare(b.category));
      }

      if (action.searchValue === '') {
        return {index: sortedGoods, filteredGoods: sortedGoods, goodsLoaded: true}
      }
      else if (action.searchType === "name") {
        goods = sortedGoods.filter((good) => ((good.name).includes(action.searchValue) ));
        return {index: [...state.index], filteredGoods: goods, goodsLoaded: true}
      }
      else if (action.searchType === "provider") {
        goods = sortedGoods.filter((good) => ((good.provider.company).includes(action.searchValue)) || ((good.provider.profile.first_name + " " + good.provider.profile.last_name).includes(action.searchValue)));
        return {index: [...state.index], filteredGoods: goods, goodsLoaded: true}
      }
      else if (action.searchType === "description") {
        goods = sortedGoods.filter((good) => ((good.desc).includes(action.searchValue) ));
        return {index: [...state.index], filteredGoods: goods, goodsLoaded: true}
      }
      else if (action.searchType === "category") {
        goods = sortedGoods.filter((good) => ((good.category).includes(action.searchValue) ));
        return {index: [...state.index], filteredGoods: goods, goodsLoaded: true}
      }
      break;
    default:
      return state
  }
}
