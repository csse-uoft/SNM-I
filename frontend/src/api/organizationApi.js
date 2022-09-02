import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches one organization.
 * @returns {Promise<*>}
 */
export async function fetchOrganizations() {
  return getJson('/api/generics/serviceProvider');
}

/**
 * This function fetches one single organization.
 * @param id
 * @returns {Promise<*>}
 */
export async function deleteOrganization(id) {
  return deleteJson('/api/generic/serviceProvider/' + id);
}