import {deleteJson, getJson, postJson, putJson} from "./index";
import {UserContext} from "../context";
import {useContext} from 'react';

export function useClientAPIs() {
  const userContext = useContext(UserContext);


  return {
    /**
     * This function fetches all clients
     * This is used now in frontend/src/Clients.js to fetch for clients.
     */
    fetchClients: async () => {
      return getJson('/api/generics/client', userContext);
    },

    searchClients: async (searchitem) => {
      return getJson(`/api/generics/client?searchitem=${searchitem}`, userContext);
    },


    /**
     * This function delete single client.
     */
    deleteClient: async (id) => {
      return deleteJson('/api/generic/client/' + id, userContext);
    },

    matchFromClient: async (id, needId) => {
      return getJson(`/api/matching/client/${id}/${needId}`, userContext);
    }
  }
}