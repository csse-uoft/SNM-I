import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function creates a new characteristic.
 * @param params
 * @returns {Promise<*>}
 */
export async function createCharacteristic(params) {
  return postJson('/api/characteristic', params);
}

/**
 * This function updates an existing characteristic
 * @param id
 * @param params
 * @returns {Promise<*>}
 */
export async function updateCharacteristic(id, params) {
  return putJson('/api/characteristic/' + id, params);
}

/**
 * This function fetches single characteristic by id.
 * This is used in add/edit characteristic and displaying single client.
 * @param id
 * @returns {Promise<any>}
 */
export async function fetchCharacteristic(id) {
  return getJson('/api/characteristic/' + id + '/');
}

/**
 * This function fetches all characteristics
 * @returns {Promise<any>}
 */
export async function fetchCharacteristics() {
  return getJson('/api/characteristics');
}

/**
 * This function deletes one single characteristic by id.
 * @param id
 * @returns {Promise<Response|any>}
 */
export async function deleteCharacteristic(id) {
  return deleteJson('/api/characteristic/delete/' + id);
}

export async function fetchCharacteristicFieldTypes() {
  return getJson('/api/characteristic/fieldTypes');
}

export async function fetchCharacteristicsDataTypes() {
  return getJson('/api/characteristic/dataTypes');
}

export async function fetchCharacteristicsOptionsFromClass() {
  return getJson('/api/characteristic/optionsFromClass');
}

export async function fetchConnectedCharacteristics(startNodeURI) {
  return getJson(`/api/characteristic/graph/${encodeURIComponent(startNodeURI)}`);
}
