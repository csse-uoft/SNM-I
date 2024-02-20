import React from 'react';

// TODO: createClients  (CSV Upload)
import { useClientAPIs } from '../api/clientApi'
import { GenericPage, Link } from "./shared";
import { fetchSingleGeneric } from "../api/genericDataApi";
import { getAddressCharacteristicId } from "./shared/CharacteristicIds";
import { fetchNeed } from '../api/needApi';
const TYPE = 'clients';

// mui-table column configurations
// TODO: Add custom print function for address
const columnsWithoutOptions = [
  {
    label: 'First Name',
    body: ({firstName, _id}) => {
      return <Link color to={`/${TYPE}/${_id}`}>{firstName}</Link>
    },
    sortBy: ({ firstName }) => firstName,
  },
  {
    label: 'Last Name',
    body: ({lastName}) => {
      return lastName;
    }
  },
  {
    label: 'Needs',
    body: ({needs}) => {
      if (needs === null || needs === undefined){
        needs = "None"
      }
      return needs;
    }
  },
  // {
  //   name: 'profile.primary_phone_number',
  //   label: 'Phone Number',
  //   body: () => {
  //     // if (profile.primary_phone_number)
  //     //   return formatPhoneNumber(profile.primary_phone_number);
  //     // return 'Not Provided';
  //   },
  // },
  // {
  //   label: 'Email',
  //   body: ({email}) => {
  //     return email || 'Not Provided';
  //   }
  // },
  // {
  //   label: 'Address',
  //   body: ({profile}) => {
  //     if (profile.address)
  //       return formatLocation(profile.address);
  //     return 'Not Provided';
  //   }
  // },
];

export default function Clients() {

  const {fetchClients, deleteClient, searchClients} = useClientAPIs();
  const nameFormatter = (client) => {
    if (client?.firstName && client?.lastName) {
      return client?.firstName + ' ' + client?.lastName;
    } else {
      return 'Client ' + client?._id;
    }
  };

  const linkFormatter = client => `/${TYPE}/${client._id}`;

  /**
   * Fetch and transform data
   * @returns {Promise<*[]>}
   */
  const fetchData = async () => {
    const clients = (await fetchClients()).data;
    const addressCharacteristicId = await getAddressCharacteristicId(); // TODO: inefficient!
    const data = [];
    for (const client of clients) {
      const clientData = {_id: client._id, address: {}};
      if (client.characteristicOccurrences)
        for (const occ of client.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'First Name') {
            clientData.firstName = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Last Name') {
            clientData.lastName = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Email') {
            clientData.email = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Address') {
            const clientObj = (await fetchSingleGeneric("client", client._id)).data; // TODO: inefficient!
            clientData.address = clientObj['characteristic_' + addressCharacteristicId];
	        }
        }
      if (client.needs){
        clientData.needs = client.needs;
      }
      data.push(clientData);
    }

    return data;
  }

  const searchData = async (searchitem) => {
    const clients = (await searchClients(searchitem)).data; // TODO: Does not contain address info
    const addressCharacteristicId = await getAddressCharacteristicId(); // TODO: inefficient!
    const data = [];
    for (const client of clients) {
      const clientData = {_id: client._id, address: {}};
      if (client.characteristicOccurrences)
        for (const occ of client.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'First Name') {
            clientData.firstName = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Last Name') {
            clientData.lastName = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Email') {
            clientData.email = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Address') {
            const clientObj = (await fetchSingleGeneric("client", client._id)).data; // TODO: inefficient!
            clientData.address = clientObj['characteristic_' + addressCharacteristicId];
	  }
        }
      data.push(clientData);
    }
    return data;

  }

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      searchData={searchData}
      deleteItem={deleteClient}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
