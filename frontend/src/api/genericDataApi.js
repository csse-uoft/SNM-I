import { deleteJson, getJson, postJson, putJson } from "./index";

export async function fetchSingleGeneric(option, id) {
  return getJson(`/api/generic/${option}/${id}`);
}
