import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createCharacteristic(params) {
  return postJson('/api/characteristic', params);
}

export async function updateCharacteristic(id, params) {
  return putJson('/api/characteristic/' + id + '/', params);
}

export async function fetchCharacteristic(id) {
  return getJson('/api/characteristic/' + id + '/');
}

export async function fetchCharacteristics() {
  return getJson('/api/characteristics');
}

export async function deleteCharacteristic(id) {
  const response = deleteJson('/api/characteristic/' + id + '/');
  if (response.status !== 204)
    throw Error('Server does not return correct code.');
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
