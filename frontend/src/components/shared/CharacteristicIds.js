import React from 'react';
import { fetchForAdvancedSearch } from "../../api/advancedSearchApi";
import { fetchCharacteristics } from "../../api/characteristicApi";
import { getJson } from "../../api/index";

/**
 * This function returns the id(s) of the name characteristic(s) of service
 * providers.
 */
export async function getServiceProviderNameCharacteristicIds() {
  let organizationNameCharacteristicId;
  let volunteerFirstNameCharacteristicId;
  let volunteerLastNameCharacteristicId;
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
 * This function returns the ids of the name characteristics of persons.
 */
export async function getPersonNameCharacteristicIds() {
  let personFirstNameCharacteristicId;
  let personLastNameCharacteristicId;
  const characteristics = (await fetchForAdvancedSearch('person', 'characteristic')).data;
  for (const characteristic of characteristics) {
    if (characteristic.name === 'First Name') {
      personFirstNameCharacteristicId = characteristic._id;
    } else if (characteristic.name === 'Last Name') {
      personLastNameCharacteristicId = characteristic._id;
    }
  }
  return {personFirstName: personFirstNameCharacteristicId,
          personLastName: personLastNameCharacteristicId};
}

/**
 * This function returns the id of the characteristic of addresses.
 */
export async function getAddressCharacteristicId() {
  let characteristicId;
  const characteristics = (await fetchCharacteristics()).data;
  for (const characteristic of characteristics) {
    if (characteristic.name === 'Address') {
      characteristicId = characteristic.id;
    }
  }
  return characteristicId;
}
