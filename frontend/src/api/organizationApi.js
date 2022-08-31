import { deleteJson, getJson, postJson, putJson } from "./index";


export async function fetchOrganizations() {
  return getJson('/api/clientOrOrganization/organization');
}

export async function deleteOrganization(id) {
  return deleteJson('/api/clientOrOrganization/delete/organization/' + id);
}