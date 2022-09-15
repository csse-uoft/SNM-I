import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches all clients
 * This is used now in frontend/src/Clients.js to fetch for clients.
 * @returns {Promise<*>}
 */
export async function fetchClients() {
  return getJson('/api/generics/client');
}

/**
 * This function delete single client.
 * @param id
 * @returns {Promise<*>}
 */
export async function deleteClient(id) {
  return deleteJson('/api/generic/client/' + id);
}