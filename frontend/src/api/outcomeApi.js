import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createOutcome(params) {
  return postJson('/api/outcome', params);
}

export async function updateOutcome(id, params) {
  return putJson('/api/outcome/' + id, params);
}

export async function deleteOutcome(id) {
  return deleteJson('/api/outcome/' + id);
}

export async function fetchOutcome(id) {
  return getJson('/api/outcome/' + id);
}

export async function fetchOutcomes() {
  return getJson('/api/outcomes');
}
