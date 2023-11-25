import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches the partner organization with the given id from the partner
 * deployment.
 * @param id
 * @returns {Promise<any>}
 */
export async function fetchPartnerOrganization(id) {
  return getJson(`/api/partnerNetwork/${id}`);
}

/**
 * This function updates the partner organization with the given id using the given
 * data from the partner deployment.
 * @param id
 * @param partnerData
 * @returns {Promise<Response|any>}
 */
export async function updatePartnerOrganization(id, body) {
  return putJson(`/api/partnerNetwork/${id}`, body);
}
