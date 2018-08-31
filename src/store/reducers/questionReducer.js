import { REQUEST_QUESTIONS, RECEIVE_QUESTIONS, REMOVE_QUESTION,
         REQUEST_QUESTION, RECEIVE_QUESTION } from '../actions/questionActions.js';
import _ from 'lodash';

export function questions(state = { questionsLoaded: false, byId: {} }, action) {
  let nextById;
  switch (action.type) {
    case REQUEST_QUESTIONS:
      return { ...state, questionsLoaded: false }
    case RECEIVE_QUESTIONS:
      const questionsById = _.keyBy(action.questions, question => question.id);
      return { ...state, byId: questionsById, questionsLoaded: true }
    case REMOVE_QUESTION:
      nextById = _.clone(state.byId);
      delete nextById[action.id]
      return { ...state, byId: nextById }
    case REQUEST_QUESTION:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return { ...state, byId: nextById }
    case RECEIVE_QUESTION:
      nextById = {...state.byId, [action.id]: { ...action.question, loaded: true }}
      return { ...state, byId: nextById }
    default:
      return state
  }
}
