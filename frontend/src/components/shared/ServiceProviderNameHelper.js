import React from 'react';
import { fetchSingleProvider } from "../../api/providersApi";
import { fetchForAdvancedSearch } from "../../api/advancedSearchApi";
import { getJson } from "../../api/index";

/**
 * This function returns the name of the service provider for the given program/service.
 */
export default async function getServiceProviderName(programOrService) {
  const serviceProvider = (await getJson(`/api/providers/${programOrService.serviceProvider.split('_')[1]}`));
  var organizationNameCharacteristicId;
  var volunteerFirstNameCharacteristicId;
  var volunteerLastNameCharacteristicId;
  const orgCharacteristics = (await fetchForAdvancedSearch('organization', 'characteristic')).data;
  for (const characteristic of orgCharacteristics) {
    if (characteristic.name === 'Organization Name') {
      organizationNameCharacteristicId = characteristic._id;
    }
  }
  const volCharacteristics = (await fetchForAdvancedSearch('volunteer', 'characteristic')).data;
  for (const characteristic of volCharacteristics) {
    if (characteristic.name === 'First Name') {
      volunteerFirstNameCharacteristicId = characteristic._id;
    } else if (characteristic.name === 'Last Name') {
      volunteerLastNameCharacteristicId = characteristic._id;
    }
  }
  if (serviceProvider.provider.type === 'organization') {
    return serviceProvider.provider.organization['characteristic_' + organizationNameCharacteristicId];
  } else if (serviceProvider.provider.type === 'volunteer') {
    const volunteerFirstName = serviceProvider.provider.volunteer['characteristic_' + volunteerFirstNameCharacteristicId];
    const volunteerLastName = serviceProvider.provider.volunteer['characteristic_' + volunteerLastNameCharacteristicId];
    return volunteerLastName + ', ' + volunteerFirstName;
  } else {
    return '#####'; // Should not happen.
  }
}
