import { deleteJson, getJson, postJson, putJson } from "./index";

export async function getNeedOccurrencesByClient(clientFullURI) {
  return getJson('/api/needOccurrences/client/' + encodeURIComponent(clientFullURI));
}

export async function getOutcomeOccurrencesByClient(clientFullURI) {
  return getJson('/api/outcomeOccurrences/client/' + encodeURIComponent(clientFullURI));
}

export async function getServiceOccurrencesByService(serviceFullURI) {
  return getJson('/api/serviceOccurrences/service/' + encodeURIComponent(serviceFullURI));
}

export async function getNeedSatisfiersByServiceOcc(serviceOccFullURI) {
  return getJson('/api/needSatisfiers/serviceOccurrence/' + encodeURIComponent(serviceOccFullURI));
}

export async function getNeedSatisfiersByService(serviceFullURI) {
  return getJson('/api/needSatisfiers/service/' + encodeURIComponent(serviceFullURI));
}
