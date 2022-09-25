import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createNeedSatisfyer(params) {
  return postJson('/api/needSatisfyer', params);
}

export async function updateNeedSatisfyer(id, params) {
  return putJson('/api/needSatisfyer/' + id, params);
}

export async function deleteNeedSatisfyer(id) {
  return deleteJson('api/needSatistyer/' + id)
}

export async function fetchNeedSatisfyer(id) {
  return getJson('api/needSatistyer/' + id)
}

export async function fetchNeedSatisfyers() {
  return getJson('/api/needSatisfyers');
}