import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * This function fetches all partner organizations.
 * @returns {Promise<any>}
 */
export async function getPartnerOrganizations() {
  return getJson(`/api/partnerOrganizations/`);
}
