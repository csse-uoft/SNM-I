import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createNeedSatisfier(params) {
  return postJson('/api/needSatisfier', params);
}

export async function updateNeedSatisfier(id, params) {
  return putJson('/api/needSatisfier/' + id, params);
}

export async function deleteNeedSatisfier(id) {
  return deleteJson('/api/needSatisfier/' + id);
}

export async function fetchNeedSatisfier(id) {
  return getJson('/api/needSatisfier/' + id);
}

export async function fetchNeedSatisfiers() {
  return getJson('/api/needSatisfiers');
}

export async function fetchConnectedNeedSatisfiers(startNodeURI) {
  return getJson(`/api/needSatisfier/graph/${encodeURIComponent(startNodeURI)}`);
}