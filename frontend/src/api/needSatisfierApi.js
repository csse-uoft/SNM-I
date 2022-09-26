import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createNeedsatisfier(params) {
  return postJson('/api/needSatisfier', params);
}

export async function updateNeedsatisfier(id, params) {
  return putJson('/api/needSatisfier/' + id, params);
}

export async function deleteNeedsatisfier(id) {
  return deleteJson('api/needSatistyer/' + id);
}

export async function fetchNeedsatisfier(id) {
  return getJson('api/needSatistyer/' + id);
}

export async function fetchNeedsatisfiers() {
  return getJson('/api/needSatisfiers');
}