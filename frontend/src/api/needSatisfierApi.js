import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createNeedSatisfier(params) {
  return postJson('/api/needSatisfier', params);
}

export async function updateNeedSatisfier(id, params) {
  return putJson('/api/needSatisfier/' + id, params);
}

export async function deleteNeedSatisfier(id) {
  return deleteJson('api/needSatistyer/' + id);
}

export async function fetchNeedSatisfier(id) {
  return getJson('api/needSatistyer/' + id);
}

export async function fetchNeedSatisfiers() {
  return getJson('/api/needSatisfiers');
}