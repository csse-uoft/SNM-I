import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches one serviceProvider.
 * @returns {Promise<*>}
 */
export async function fetchServiceProviders() {
  return getJson('/api/generics/serviceProvider');
}

/**
 * This function fetches one single serviceProvider.
 * @param id
 * @returns {Promise<*>}
 */
export async function deleteServiceProvider(id) {
  return deleteJson('/api/generic/serviceProvider/' + id);
}