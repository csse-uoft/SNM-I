import { deleteJson, getJson, postJson, putJson } from "./index";

export async function getNeedOccurrencesByClient(clientFullURI) {
  return getJson('/api/needOccurrences/client/' + encodeURIComponent(clientFullURI));
}

export async function getOutcomeOccurrencesByClient(clientFullURI) {
  return getJson('/api/outcomeOccurrences/client/' + encodeURIComponent(clientFullURI));
}

export async function getProgramOccurrencesByProgram(programFullURI) {
  return getJson('/api/programOccurrences/program/' + encodeURIComponent(programFullURI));
}

export async function getNeedSatisfiersByProgramOcc(programOccFullURI) {
  return getJson('/api/needSatisfiers/programOccurrence/' + encodeURIComponent(programOccFullURI));
}

export async function getNeedSatisfiersByProgram(programFullURI) {
  return getJson('/api/needSatisfiers/program/' + encodeURIComponent(programFullURI));
}
