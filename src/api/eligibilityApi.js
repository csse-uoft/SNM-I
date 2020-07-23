import { postJson, putJson, getJson, deleteJson } from "./index";

export function createEligibility(params) {
  return postJson('/eligibility_criteria/', params);
}

export function updateEligibility(id, params) {
  return putJson('/eligibility_criteria/' + id + '/', params);
}

export function fetchEligibility(id) {
  return getJson('/eligibility_criteria/' + id + '/');
}

export function fetchEligibilities() {
  return getJson('/eligibility_criteria/');
}

export async function deleteEligibility(id, params) {
  const response = await deleteJson('/eligibility_criteria/' + id + '/', params);
  if (response.status !== 204)
    throw Error('Server does not return correct code.');
}
