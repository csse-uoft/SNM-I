import React from 'react';
// TODO: createProviderWithCSV  (CSV Upload)
import { fetchProviders, deleteProvider } from '../api/mockedApi/providers';

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
    label: 'Name',
    body: ({id, profile, company, type}) => {
      return <Link color to={`/${TYPE}/${id}`}>
        {formatProviderName({
          company, type, profile,
        })}
      </Link>
    },
  },
  {
    label: 'Type',
    body: ({type}) => type,
  },
  {
    label: 'Email',
    body: ({profile}) => profile.email,
  },
  {
    label: 'Phone Number',
    body: ({profile}) => {
      if (profile.primary_phone_number)
        return formatPhoneNumber(profile.primary_phone_number);
      return 'Not Provided';
    }
  },
  {
    name: 'main_address',
    label: 'Address',
    body: ({main_address}) => {
      if (main_address)
        return formatLocation(main_address);
      return 'Not Provided';
    }
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
      tableOptions={{
        idField: 'id'
      }}
    />
  )
}
