import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches all clients
 * This is used now in frontend/src/Clients.js to fetch for clients.
 * @returns {Promise<*>}
 */
export async function fetchPersons() {
  return getJson('/api/generics/person');
}

/**
 * This function delete single client.
 * @param id
 * @returns {Promise<*>}
 */
export async function deletePerson(id) {
  return deleteJson('/api/generic/person/' + id);
}