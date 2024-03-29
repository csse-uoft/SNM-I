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
    if (person.firstName && person.lastName) {
      return person.firstName + ' ' + person.lastName;
    } else {
      return 'Person ' + person._id;
    }
  };

  const linkFormatter = person => `/${TYPE}/${person._id}`;

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
      if (person.address) {
        personData.address = person.address;
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
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
