import React from 'react';
// TODO: createProviderWithCSV  (CSV Upload)
import { fetchProviders, deleteProvider } from '../store/actions/providerActions.js'

import { formatLocation } from '../helpers/location_helpers'
import { formatPhoneNumber } from '../helpers/phone_number_helpers'

import { GenericPage, Link } from "./shared";

const TYPE = 'providers';

const formatProviderName = provider => {
  const {profile} = provider;
  if (provider.type === 'Individual')
    return profile && profile.first_name + " " + profile.last_name;
  else
    return provider.company;
};

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
    name: 'company',
    options: {
      sort: false,
      viewColumns: false,
      display: 'excluded',
      searchable: false,
      filter: false,
    }
  },
  {
    name: 'profile',
    label: 'Name',
    options: {
      sort: true,
      customBodyRender: (profile, {rowData}) => {
        return (
          <Link color to={`/${TYPE}/${rowData[0]}`}>
            {formatProviderName({
              company: rowData[1],
              type: rowData[3],
              profile,
            })}
          </Link>
        );
      }
    }
  },
  {
    name: 'type',
    label: 'Type',
    options: {
      sort: true,
    }
  },
  {
    name: 'profile.email',
    label: 'Email',
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
    name: 'main_address',
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

export default function Providers() {

  const generateMarkers = (data, pageNumber, rowsPerPage) => {
    // TODO: verify this works as expected
    const currPageProviders = data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageProviders.map(provider => ({
      position: {lat: Number(provider.main_address.lat), lng: Number(provider.main_address.lng)},
      title: formatProviderName(provider),
      link: `/${TYPE}/${provider.id}`,
      content: provider.main_address && formatLocation(provider.main_address),
    })).filter(provider => provider.position.lat && provider.position.lng);
  };

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchProviders}
      deleteItem={deleteProvider}
      generateMarkers={generateMarkers}
      nameFormatter={formatProviderName}
    />
  )
}
