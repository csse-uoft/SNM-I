import React from 'react';

// TODO: createClients  (CSV Upload)
import { fetchClients, deleteClient } from '../store/actions/clientActions.js'

import { formatLocation } from '../helpers/location_helpers'
import { formatPhoneNumber } from '../helpers/phone_number_helpers'

import { GenericPage, Link } from "./shared";

const TYPE = 'clients';

// mui-table column configurations
// TODO: Add custom print function for address
const columnsWithoutOptions = [
  {
    label: 'First Name',
    body: ({id, profile}) => {
      return <Link color to={`/${TYPE}/${id}`}>{profile.first_name}</Link>
    }
  },
  {
    label: 'Last Name',
    body: ({profile}) => {
      return profile.last_name;
    }
  },
  {
    name: 'profile.primary_phone_number',
    label: 'Phone Number',
    body: ({profile}) => {
      if (profile.primary_phone_number)
        return formatPhoneNumber(profile.primary_phone_number);
      return 'Not Provided';
    },
  },
  {
    label: 'Email',
    body: ({profile}) => {
      return profile.email;
    }
  },
  {
    label: 'Address',
    body: ({profile}) => {
      if (profile.address)
        return formatLocation(profile.address);
      return 'Not Provided';
    }
  },
];

export default function Clients() {

  const nameFormatter = (client) => {
    return client.profile.first_name + ' ' + client.profile.last_name;
  };

  const generateMarkers = (clients, pageNumber, rowsPerPage) => {
    // TODO: verify this works as expected
    const currPageClients = clients.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageClients.map(client => ({
      position: {lat: Number(client.address.lat), lng: Number(client.address.lng)},
      title: nameFormatter(client),
      link: `/${TYPE}/${client.id}`,
      content: client.address && formatLocation(client.address),
    })).filter(client => client.position.lat && client.position.lng);
  };

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchClients}
      deleteItem={deleteClient}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: 'id'
      }}
    />
  )
}
