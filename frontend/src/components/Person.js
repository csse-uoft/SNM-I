import React from 'react';

import {fetchPersons, deletePerson} from '../api/personApi'
import {fetchSingleGeneric} from "../api/genericDataApi";
import {GenericPage, Link} from "./shared";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";

const TYPE = 'person';

// mui-table column configurations
// TODO: Add custom print function for address
const columnsWithoutOptions = [
  {
    label: 'First Name',
    body: ({firstName, _id}) => {
      return <Link color to={`/${TYPE}/${_id}`}>{firstName}</Link>
    },
    sortBy: ({firstName}) => firstName,
  },
  {
    label: 'Last Name',
    body: ({lastName}) => {
      return lastName;
    }
  },
  {
    label: 'Create Date',
    body: ({createDate}) => {
      if (createDate) {
        return new Date(createDate).toLocaleString();
      }
    },
    sortBy: ({createDate}) => Number(new Date(createDate)),
  },
];

export default function Person() {

  const nameFormatter = (person) => {
    return person.firstName + ' ' + person.lastName;
  };

  const generateMarkers = (persons, pageNumber, rowsPerPage) => {
    const currPagePersons = persons.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPagePersons.map(person => ({
      position: (person.address?.lat && person.address?.lng)
        ? {lat: Number(person.address.lat), lng: Number(person.address.lng)}
        : {...person.address},
      title: nameFormatter(person),
      link: `/${TYPE}/${person.id}`,
    })).filter(person => (person.position?.lat && person.position?.lng) || (person.position?.streetName && person.position?.city))
  };


  /**
   * Fetch and transform data
   * @returns {Promise<*[]>}
   */
  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const persons = (await fetchPersons()).data;
    const data = [];
    for (const person of persons) {
      // parse person data and assign to corresponding fields
      const personData = {_id: person._id};
      if (person.characteristicOccurrences)
        for (const occ of person.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Address') {
            const personObj = (await fetchSingleGeneric("person", person._id)).data; // TODO: inefficient!
            personData.address = personObj['characteristic_' + addressCharacteristicId];
          }
        }
      personData.firstName = person.firstName;
      personData.lastName = person.lastName;
      personData.createDate = person.createDate;
      data.push(personData);
    }
    return data;

  }

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deletePerson}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
