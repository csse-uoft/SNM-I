import React from 'react';
// TODO: createProviderWithCSV  (CSV Upload)

import { formatPhoneNumber } from '../helpers/phone_number_helpers'

import { GenericPage, Link } from "./shared";
import { fetchSingleProvider, deleteSingleProvider, fetchMultipleProviders, searchMultipleProviders } from "../api/providersApi";
import { fetchForServiceProviderAdvancedSearch } from "../api/advancedSearchApi";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";
import { getInstancesInClass } from '../api/dynamicFormApi';

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
  {
    label: 'Status',
    body: ({type, status, organizationProvider}) => {
      if (type === 'organization') {
        return status;
      } else if (organizationProvider) {
        organizationProvider = {...organizationProvider, type: 'organization'}
        return <p>
          From <Link color to={formatProviderLink(organizationProvider)}>{organizationProvider.organization.status}</Link>
        </p>;
      } else {
        return 'Unaffiliated';
      }
    },
  },
  {
    label: 'Shareability',
    body: ({shareability}) => shareability,
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
    const shareabilities = await getInstancesInClass(':Shareability');
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
      if (innerData.status)
        providerData.status = innerData.status;
      if (innerData.endpointUrl)
        providerData.endpointUrl = innerData.endpointUrl;
      if (innerData.endpointPort)
        providerData.endpointPort = innerData.endpointPort;
      if (innerData.apiKey)
        providerData.apiKey = innerData.apiKey;
      if (innerData.shareability)
        providerData.shareability = shareabilities[innerData.shareability];
      if (innerData.organization)
        providerData.organizationProvider = providers.find(obj => obj.organization?._id === innerData.organization._id);
      if (innerData.partnerOrganizations)
        providerData.partnerOrganizations = innerData.partnerOrganizations;
      data.push(providerData);
    }
    return data;
  }

  const searchData = async (searchitem) => {
    const providers = (await searchMultipleProviders(searchitem)).data;
    const data = [];
    for (const provider of providers) {
      const providerData = {_id: provider._id, type: provider.type};
      const innerData = provider[provider.type];

      if (innerData.characteristicOccurrences)
        for (const occ of innerData.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Organization Name') {
            providerData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Organization Address') {
            providerData.address = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Email') {
            providerData.email = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'First Name') {
            providerData.firstName = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Last Name') {
            providerData.lastName = occ.dataStringValue;
          }

        }
      data.push(providerData);
    }
    return data;

  }

  const advancedProviderSearch = async (searchitem) => {
    const providers = (await fetchForServiceProviderAdvancedSearch(searchitem)).data;
    const data = [];
    for (const provider of providers) {
      const providerData = {_id: provider._id, type: provider.type};
      const innerData = provider[provider.type];

      if (innerData.characteristicOccurrences)
        for (const occ of innerData.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Organization Name') {
            providerData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Organization Address') {
            providerData.address = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Email') {
            providerData.email = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'First Name') {
            providerData.firstName = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Last Name') {
            providerData.lastName = occ.dataStringValue;
          }

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
      advancedSearch={advancedProviderSearch}
      searchData={searchData}
      deleteItem={deleteSingleProvider}
      nameFormatter={formatProviderName}
      linkFormatter={formatProviderLink}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
