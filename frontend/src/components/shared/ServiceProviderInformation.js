import React from 'react';
import { fetchSingleProvider } from "../../api/providersApi";
import { fetchForAdvancedSearch } from "../../api/advancedSearchApi";
import { getJson } from "../../api/index";

/**
 * This function returns the id(s) of the name characteristic(s) of service
 * providers.
 */
export async function getServiceProviderNameCharacteristicIds() {
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
  return {organizationName: organizationNameCharacteristicId,
          volunteerFirstName: volunteerFirstNameCharacteristicId,
          volunteerLastName: volunteerLastNameCharacteristicId};
}

/**
 * This function returns the name of the service provider for the given
 * program/service. characteristicIds is the object returned by
 * getServiceProviderNameCharacteristicIds.
 */
export async function getServiceProviderName(programOrService, characteristicIds) {
  const serviceProvider = (await getJson(`/api/providers/${programOrService.serviceProvider.split('_')[1]}`));
  if (serviceProvider.provider.type === 'organization') {
    return serviceProvider.provider.organization['characteristic_' + characteristicIds.organizationName];
  } else if (serviceProvider.provider.type === 'volunteer') {
    const volunteerFirstName = serviceProvider.provider.volunteer['characteristic_' + characteristicIds.volunteerFirstName];
    const volunteerLastName = serviceProvider.provider.volunteer['characteristic_' + characteristicIds.volunteerLastName];
    return volunteerLastName + ', ' + volunteerFirstName;
  } else {
    return '#####'; // Should not happen.
  }
}

/**
 * This function returns the type (organization/volunteer) of the service provider for the given program/service.
 */
export async function getServiceProviderType(programOrService) {
  const serviceProvider = (await getJson(`/api/providers/${programOrService.serviceProvider.split('_')[1]}`));
  return serviceProvider.provider.type;
}
