import { deleteJson, getJson, postJson, putJson } from "./index";

export async function fetchSingleProvider(id) {
  return getJson(`/api/providers/${id}`);
}

export async function createSingleProvider(body) {
  return postJson(`/api/providers`, body)
}

export async function updateSingleProvider(id, body) {
  return putJson(`/api/providers/${id}`, body)
}

export async function fetchMultipleProviders(type) {
  return getJson(`/api/providers`);
}

export async function deleteSingleProvider(type, id) {
  return deleteJson(`/api/providers/${id}`);
}
