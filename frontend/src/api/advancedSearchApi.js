import { deleteJson, getJson, postJson, putJson } from "./index";

export async function fetchForAdvancedSearch(genericType, genericItemType) {
  return getJson(`/api/advancedSearch/fetchForAdvancedSearch/${genericType}/${genericItemType}`)
}

export async function advancedSearchGeneric(genericType, body) {
  return putJson(`/api/advancedSearch/${genericType}`, body)
}