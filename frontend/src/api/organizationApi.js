import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches one organization.
 * Could be replaced with fetchGeneric in the future
 * @returns {Promise<*>}
 */
export async function fetchOrganizations() {
  return getJson('/api/clientOrOrganization/organization');
}

/**
 * This function fetches one single organization.
 * Should be replaced with fetchSingleClient.
 * @param id
 * @returns {Promise<*>}
 */
export async function deleteOrganization(id) {
  return deleteJson('/api/clientOrOrganization/delete/organization/' + id);
}