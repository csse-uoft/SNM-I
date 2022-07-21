import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createQuestion({content_type, text}) {
  return postJson('/api/questions/createQuestion', {content_type, text});
}

export async function updateQuestion(id, {content_type, text}) {
  return postJson('/api/questions/updateQuestion/' + id + '/', {content_type, text});
}

export async function fetchQuestion(id) {
  return getJson('/api/questions/fetchQuestion/' + id + '/');
}

export async function fetchQuestions() {
  return getJson('/api/questions/fetchQuestions');
}

export async function deleteQuestion(id) {
  const response = deleteJson('/api/questions/deleteQuestion/' + id + '/');
  if (response.status !== 204)
    throw Error('Server does not return correct code.');
}