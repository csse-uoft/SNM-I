import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches all clients
 * This is used now in frontend/src/Clients.js to fetch for clients.
 * Could be replaced into fetchGeneric in the future
 * @returns {Promise<*>}
 */
export async function fetchClients() {
  return getJson('/api/generics/client');
}

/**
 * This function delete single client.
 * Could be replaced into deleteSingleGeneric in the future
 * @param id
 * @returns {Promise<*>}
 */
export async function deleteClient(id) {
  return deleteJson('/api/generic/client/' + id);
}