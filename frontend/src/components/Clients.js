import React from 'react';

// TODO: createClients  (CSV Upload)
import { fetchClients, deleteClient } from '../api/clientApi'

import { formatLocation } from '../helpers/location_helpers'
import { formatPhoneNumber } from '../helpers/phone_number_helpers'

import { GenericPage, Link } from "./shared";

const TYPE = 'clients';

// mui-table column configurations
// TODO: Add custom print function for address
const columnsWithoutOptions = [
  {
    label: 'First Name',
    body: ({firstName, _id}) => {
      return <Link color to={`/${TYPE}/${_id}`}>{firstName}</Link>
    }
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
  {
    label: 'Email',
    body: ({email}) => {
      return email || 'Not Provided';
    }
  },
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

  const nameFormatter = (client) => {
    return client.firstName + ' ' + client.lastName;
  };

  const generateMarkers = (clients, pageNumber, rowsPerPage) => {
    return [];
    // TODO: verify this works as expected
    const currPageClients = clients.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageClients.map(client => ({
      position: {lat: Number(client.address.lat), lng: Number(client.address.lng)},
      title: nameFormatter(client),
      link: `/${TYPE}/${client.id}`,
      content: client.address && formatLocation(client.address),
    })).filter(client => client.position.lat && client.position.lng);
  };

  /**
   * Fetch and transform data
   * @returns {Promise<*[]>}
   */
  const fetchData = async () => {
    const clients = (await fetchClients()).data;
    const data = [];
    for (const client of clients) {
      const clientData = {_id: client._id};
      if (client.characteristicOccurrences)
        for (const occ of client.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'First Name') {
            clientData.firstName = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Last Name') {
            clientData.lastName = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Email') {
            clientData.email = occ.dataStringValue;
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
      deleteItem={deleteClient}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
