import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches one organization.
 * @returns {Promise<*>}
 */
export async function fetchOrganizations() {
  return getJson('/api/generics/organization');
}

/**
 * This function fetches one single organization.
 * Should be replaced with fetchSingleGeneric.
 * @param id
 * @returns {Promise<*>}
 */
export async function deleteOrganization(id) {
  return deleteJson('/api/generic/organization/' + id);
}