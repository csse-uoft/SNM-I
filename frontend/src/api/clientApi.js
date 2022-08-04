import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createClient(body) {
  return postJson('/api/clientOrOrganization/client/', body);
}

export async function updateClient(id, body) {
  return putJson('/api/client/' + id, body);
}

export async function fetchClient(id) {
  return getJson('/api/clientOrOrganization/client/' + id);
}

export async function fetchClients() {
  return getJson('/api/client');
}

export async function deleteClient(id) {
  return deleteJson('/api/client/delete/' + id);
}