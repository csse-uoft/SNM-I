import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches the {genericItemType} in category {genericType}
 * @param genericType
 * @param genericItemType
 * @returns {Promise<any>}
 * genericItemType: characteristic, question...
 * genericType: client, organization...
 */
export async function fetchForAdvancedSearch(genericType, genericItemType) {
  return getJson(`/api/advancedSearch/fetchForAdvancedSearch/${genericType}/${genericItemType}`)
}

/**
 * This function gives advanced search result.
 * @param genericType
 * @param genericItemType
 * @param body
 * @returns {Promise<Response|any>}
 * genericItemType: characteristic, question...
 * genericType: client, organization...
 * body: {search conditions, search Types}
 */
export async function advancedSearchGeneric(genericType, genericItemType, body) {
  return putJson(`/api/advancedSearch/${genericType}/${genericItemType}`, body)
}