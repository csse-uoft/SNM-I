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
    name: 'id',
    options: {
      sort: false,
      viewColumns: false,
      display: 'excluded',
      searchable: false,
      filter: false,
    }
  },
  {
    name: 'profile.first_name',
    label: 'First Name',
    options: {
      sort: true,
      customBodyRender: (data, {rowData}) => {
        return <Link color to={`/${TYPE}/${rowData[0]}`}>{data}</Link>
      }
    }
  },
  {
    name: 'profile.last_name',
    label: 'Last Name',
    options: {
      sort: true,
    }
  },
  {
    name: 'profile.primary_phone_number',
    label: 'Phone Number',
    options: {
      customBodyRender: data => {
        if (data)
          return formatPhoneNumber(data);
        return 'Not Provided';
      },
    },
  },
  {
    name: 'profile.email',
    label: 'Email',
  },
  {
    name: 'address',
    label: 'Address',
    options: {
      sort: false,
      customBodyRender: data => {
        if (data)
          return formatLocation(data);
        return 'Not Provided';
      },
    },
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
    />
  )
}
