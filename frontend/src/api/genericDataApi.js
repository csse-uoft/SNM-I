import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches one single generic option by id.
 * Option could be client, organization...
 * @param option
 * @param id
 * @returns {Promise<any>}
 */
export async function fetchSingleGeneric(option, id) {
  return getJson(`/api/generic/${option}/${id}`);
}

/**
 * This function creates one single generic option.
 * Option could be client, organization...
 * @param option
 * @param body
 * @returns {Promise<Response|any>}
 */
export async function createSingleGeneric(option, body) {
  return postJson(`/api/generic/${option}`, body)
}

/**
 * This function updates one single generic option.
 * Option could be client, organization...
 * @param option
 * @param id
 * @param body
 * @returns {Promise<Response|any>}
 */
export async function updateSingleGeneric(option, id, body) {
  return putJson(`/api/generic/${option}/${id}`, body)
}

/**
 * This function fetches all instances with the generic given type
 */ 
export async function fetchMultipleGeneric(type) {
  return getJson(`/api/generics/${type}`);
}

export async function fetchSearchGeneric(type, searchitem) {
  return getJson(`/api/generics/${type}?searchitem=${searchitem}`);
}


/**
 * This function delete single generic instance.
 */
export async function deleteSingleGeneric(type, id) {
  return deleteJson(`/api/generic/${type}/${id}`);
}
