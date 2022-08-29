import { deleteJson, getJson, postJson, putJson } from "./index";

export async function fetchForAdvancedSearch(genericType, genericItemType) {
  return getJson(`/api/advancedSearch/fetchForAdvancedSearch/${genericType}/${genericItemType}`)
}

export async function advancedSearchGeneric(genericType, genericItemType, body) {
  return putJson(`/api/advancedSearch/${genericType}/${genericItemType}`, body)
}