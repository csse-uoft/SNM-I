import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createQuestion(params) {
  return postJson('/api/question', params);
}

export async function updateQuestion(id, params) {
  return putJson('/api/question/' + id, params);
}

export async function fetchQuestion(id) {
  return getJson('/api/question/' + id + '/');
}

export async function fetchQuestions() {
  return getJson('/api/questions');
}

export async function deleteQuestion(id) {
  return deleteJson('/api/question/delete/' + id);
}