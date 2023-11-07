import React from 'react';
// TODO: createProviderWithCSV  (CSV Upload)

import { formatPhoneNumber } from '../helpers/phone_number_helpers'

import { GenericPage, Link } from "./shared";
import { fetchSingleProvider, deleteSingleProvider, fetchMultipleProviders } from "../api/providersApi";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";

const TYPE = 'providers';

export const formatProviderName = provider => {
  if (typeof provider === 'undefined') {
    return '';
  } else if (provider.name) {
    return provider.name;
  } else if (provider.lastName || provider.firstName) {
    return `${provider.lastName || ''}, ${provider.firstName || ''}`;
  } else if (provider.type === 'organization') {
    return 'Organization ' + provider._id;
  } else {
    return 'Volunteer ' + provider._id;
  }
};

export const formatProviderLink = provider => {
  return `/${TYPE}/${provider.type.toLowerCase()}/${provider._id}`;
};

// mui-table column configurations
// TODO: Add custom print function for address
const columnsWithoutOptions = [
  {
    label: 'Name',
    body: ({_id, name, type, lastName, firstName}) => {
      return <Link color to={formatProviderLink({_id, name, type, lastName, firstName}) + `/edit`}>
        {formatProviderName({_id, name, type, lastName, firstName})}
      </Link>
    },
    sortBy: ({_id, name, type, lastName, firstName}) => formatProviderName({_id, name, type, lastName, firstName}),
  },
  {
    label: 'Type',
    body: ({type}) => type,
  },
  // {
  //   label: 'Email',
  //   body: ({profile}) => profile?.email,
  // },
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

  /**
   * Fetch and transform data
   * @returns {Promise<*[]>}
   */
  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const providers = (await fetchMultipleProviders()).data;
    const data = [];
    for (const provider of providers) {
      const providerData = {_id: provider._id, type: provider.type};
      const innerData = provider[provider.type];

      if (innerData.characteristicOccurrences)
        for (const occ of innerData.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Organization Name') {
            providerData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Email') {
            providerData.email = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'First Name') {
            providerData.firstName = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Last Name') {
            providerData.lastName = occ.dataStringValue;
          }
        }
      if (innerData.address)
        providerData.address = innerData.address;
      if (innerData.partner) {
        providerData.partner = innerData.partner;
        if (innerData.endpointUrl)
          providerData.endpointUrl = innerData.endpointUrl;
        if (innerData.endpointPort)
          providerData.endpointPort = innerData.endpointPort;
      }
      data.push(providerData);
    }
    return data;
  }

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteSingleProvider}
      nameFormatter={formatProviderName}
      linkFormatter={formatProviderLink}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
