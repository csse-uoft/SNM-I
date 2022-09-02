import React from 'react';
// TODO: createProviderWithCSV  (CSV Upload)
import { fetchServiceProviders, deleteServiceProvider } from '../api/serviceProviderApi';

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
    body: ({_id, name, type}) => {
      return <Link color to={`/${TYPE}/${type.toLowerCase()}/${_id}`}>
        {name}
      </Link>
    },
  },
  {
    label: 'Type',
    body: ({type}) => type,
  },
  {
    label: 'Email',
    body: ({profile}) => profile?.email,
  },
  // {
  //   label: 'Phone Number',
  //   body: ({profile}) => {
  //     if (profile.primary_phone_number)
  //       return formatPhoneNumber(profile.primary_phone_number);
  //     return 'Not Provided';
  //   }
  // },
  // {
  //   name: 'address',
  //   label: 'Address',
  //   body: ({address}) => {
  //     if (address)
  //       return formatLocation(address);
  //     return 'Not Provided';
  //   }
  // },
];

export default function Providers() {

  const generateMarkers = (data, pageNumber, rowsPerPage) => {
    return [];
    // TODO: verify this works as expected
    const currPageProviders = data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageProviders.map(provider => ({
      position: {lat: Number(provider.main_address.lat), lng: Number(provider.main_address.lng)},
      title: formatProviderName(provider),
      link: `/${TYPE}/${provider.id}`,
      content: provider.main_address && formatLocation(provider.main_address),
    })).filter(provider => provider.position.lat && provider.position.lng);
  };

  /**
   * Fetch and transform data
   * @returns {Promise<*[]>}
   */
  const fetchData = async () => {
    const orgs = (await fetchServiceProviders()).data;
    const data = [];
    for (const org of orgs) {
      const orgData = {_id: org._id, type: 'Organization'};
      if (org.characteristicOccurrences)
        for (const occ of org.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Organization name') {
            orgData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Organization address') {
            orgData.address = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Email') {
            orgData.email = occ.dataStringValue;
          }

        }
      data.push(orgData);
    }
    return data;

  }

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteServiceProvider}
      generateMarkers={generateMarkers}
      nameFormatter={formatProviderName}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
