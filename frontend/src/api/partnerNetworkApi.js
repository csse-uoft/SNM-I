import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches the partner organization with the given id.
 * @param id
 * @returns {Promise<any>}
 */
export async function refreshPartnerOrganization(id) {
  return getJson(`/api/partnerNetwork/${id}`);
}