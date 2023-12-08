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

/**
 * This function sends the referral with the given ID to the receiving service
 * provider if it is in a partner deployment.
 * @param id
 * @returns {Promise<Response|any>}
 */
export async function sendPartnerReferral(id, body) {
  return postJson(`/api/partnerNetwork/referral/${id}`, body);
}

/**
 * This function updates the referral with the given ID in the receiving service
 * provider's deployment.
 * @param id
 * @returns {Promise<Response|any>}
 */
export async function updatePartnerReferral(id, body) {
  return putJson(`/api/partnerNetwork/referral/${id}`, body);
}
