import {deleteJson, getJson, postJson, putJson} from "./index";
import {UserContext} from "../context";
import {useContext} from 'react';

export function useEligibilityAPIs() {
  const userContext = useContext(UserContext);

  return {
    /**
     * Get Eligibility Configs for populating eligibility field
     */
    fetchEligibilityConfig: async () => {
      return getJson('/api/eligibility/config', userContext);
    },
  }
}