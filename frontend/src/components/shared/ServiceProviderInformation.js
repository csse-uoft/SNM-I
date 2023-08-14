import React from 'react';
import { fetchSingleProvider } from "../../api/providersApi";
import { fetchForAdvancedSearch } from "../../api/advancedSearchApi";
import { getJson } from "../../api/index";

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
