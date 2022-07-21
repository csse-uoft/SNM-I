import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createCharacteristic({content_type, text}) {
  return postJson('/api/characteristic', {content_type, text});
}

export async function updateCharacterisric(id, {content_type, text}) {
  return putJson('/api/characteristic/' + id + '/', {content_type, text});
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