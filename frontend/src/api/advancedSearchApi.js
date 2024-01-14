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

export async function fetchForServiceAdvancedSearch(body) {

  return postJson(`/api/advancedSearch/service/`, body)
}

export async function fetchForProgramAdvancedSearch(body) {

  return postJson(`/api/advancedSearch/program/`, body)
}

export async function fetchForServiceProviderAdvancedSearch(body) {

  return postJson(`/api/advancedSearch/serviceprovider/`, body)
}