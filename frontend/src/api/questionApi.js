import { deleteJson, getJson, postJson, putJson } from "./index";

export function createQuestion(params) {
  return postJson('/questions/', params);
}

export function updateQuestion(id, params) {
  return putJson('/questions/' + id + '/', params);
}

export function fetchQuestion(id) {
  return getJson('/questions/' + id + '/');
}

export function fetchQuestions() {
  return getJson('/questions/');
}

export async function deleteQuestion(id, params) {
  const response = await deleteJson('/questions/' + id + '/', params);
  if (response.status !== 204)
    throw Error('Server does not return correct code.');
}
