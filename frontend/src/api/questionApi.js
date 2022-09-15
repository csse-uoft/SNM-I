import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function creates one question.
 * @param params
 * @returns {Promise<Response|any>}
 */
export async function createQuestion(params) {
  return postJson('/api/question', params);
}

/**
 * This function updates one question by id.
 * @param id
 * @param params
 * @returns {Promise<Response|any>}
 */
export async function updateQuestion(id, params) {
  return putJson('/api/question/' + id, params);
}

/**
 * This function fetches one single question by id.
 * @param id
 * @returns {Promise<any>}
 */
export async function fetchQuestion(id) {
  return getJson('/api/question/' + id + '/');
}

/**
 * This function fetches all questions
 * @returns {Promise<any>}
 */
export async function fetchQuestions() {
  return getJson('/api/questions');
}

/**
 * This function deletes one single question by id.
 * @param id
 * @returns {Promise<Response|any>}
 */
export async function deleteQuestion(id) {
  return deleteJson('/api/question/delete/' + id);
}