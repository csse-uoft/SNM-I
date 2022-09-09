import { deleteJson, getJson, postJson, putJson } from "./index";

// A placeholder providerType to make the function signature same as generaicDataApi.
export async function fetchSingleProvider(providerType, id) {
  const body = await getJson(`/api/providers/${id}`);

  return body;
}

export async function createSingleProvider(providerType, data) {
  return postJson(`/api/providers`, {data, providerType});
}

export async function updateSingleProvider(providerType, id, body) {
  return putJson(`/api/providers/${id}`, {data, providerType});
}

export async function fetchMultipleProviders() {
  return getJson(`/api/providers`);
}

export async function deleteSingleProvider(id) {
  return deleteJson(`/api/providers/${id}`);
}
