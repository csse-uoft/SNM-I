import React from 'react';
import { fetchForAdvancedSearch } from "../../api/advancedSearchApi";
import { getJson } from "../../api/index";

/**
 * This function returns the ids of the name characteristics of persons.
 */
export async function getPersonNameCharacteristicIds() {
  var personFirstNameCharacteristicId;
  var personLastNameCharacteristicId;
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
