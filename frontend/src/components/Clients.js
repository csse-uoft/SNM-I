import React from 'react';

// TODO: createClients  (CSV Upload)
import { useClientAPIs } from '../api/clientApi'
import { formatLocation } from '../helpers/location_helpers'
import { GenericPage, Link } from "./shared";
import { fetchSingleGeneric } from "../api/genericDataApi";
import { getAddressCharacteristicId } from "./shared/CharacteristicIds";

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
    return client.firstName + ' ' + client.lastName;
  };

  const generateMarkers = (clients, pageNumber, rowsPerPage) => {
    // TODO: verify this works as expected
    const currPageClients = clients.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageClients.map(client => ({
      position: {lat: Number(client.address.lat), lng: Number(client.address.lng)},
      title: nameFormatter(client),
      link: `/${TYPE}/${client._id}`,
      content: client.address && formatLocation(client.address),
    })).filter(client => client.position.lat && client.position.lng);
  };

  /**
   * Fetch and transform data
   * @returns {Promise<*[]>}
   */
  const fetchData = async () => {
    const clients = (await fetchClients()).data; // TODO: Does not contain address info
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
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
