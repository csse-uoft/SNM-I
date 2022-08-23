import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createOrganization(body) {
  return postJson('/api/clientOrOrganization/organization/', body);
}

export async function updateOrganization(id, body) {
  return putJson('/api/organization/' + id, body);
}

export async function fetchOrganization(id) {
  return getJson('/api/clientOrOrganization/organization/' + id);
}

export async function fetchOrganizations() {
  return getJson('/api/clientOrOrganization/organization');
}

export async function deleteOrganization(id) {
  return deleteJson('/api/clientOrOrganization/delete/organization/' + id);
}