import { deleteJson, getJson, postJson, putJson } from "./index";

export async function fetchSingleGeneric(option, id) {
  return getJson(`/api/generic/${option}/${id}`);
}

export async function createSingleGeneric(option, body) {
  return postJson(`/api/generic/${option}`, body)
}

export async function updateSingleGeneric(option, id, body) {
  return putJson(`/api/generic/${option}/${id}`, body)
}