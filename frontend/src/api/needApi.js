import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createNeed(params) {
  return postJson('/api/need', params);
}

export async function updateNeed(id, params) {
  return putJson('/api/need/' + id, params);
}

export async function deleteNeed(id) {
  return deleteJson('/api/need/' + id);
}

export async function fetchNeed(id) {
  return getJson('/api/need/' + id);
}

export async function fetchNeeds() {
  return getJson('/api/needs');
}