import { deleteJson, getJson, postJson, putJson } from "./index";

export async function fetchInternalTypeByFormType(formType) {
  return getJson('/api/internalTypes/' + formType);
}