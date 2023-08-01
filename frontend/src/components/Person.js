import React from 'react';

import { fetchPersons, deletePerson } from '../api/personApi'

import { formatLocation } from '../helpers/location_helpers'
import { GenericPage, Link } from "./shared";

const TYPE = 'person';

// mui-table column configurations
// TODO: Add custom print function for address
const columnsWithoutOptions = [
    {
        label: 'First Name',
        body: ({ firstName, _id }) => {
            //   return <Link color to={`/${TYPE}/${_id}`}>{firstName}</Link>
            return firstName;
        }
    },
    {
        label: 'Last Name',
        body: ({ lastName }) => {
            return lastName;
        }
    },
    {
        label: 'Create Date',
        body: ({ createDate }) => {
            if (createDate){
                return new Date(createDate).toLocaleString();
            }
            
        }
    },
];

export default function Person() {

    const nameFormatter = (person) => {
        return person.firstName + ' ' + person.lastName;
      };
    
      const generateMarkers = (persons, pageNumber, rowsPerPage) => {
        return [];
        // TODO: verify this works as expected
        const currPagePersons = persons.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
        return currPagePersons.map(person => ({
          position: {lat: Number(person.address.lat), lng: Number(person.address.lng)},
          title: nameFormatter(person),
          link: `/${TYPE}/${person.id}`,
          content: person.address && formatLocation(person.address),
        })).filter(person => person.position.lat && person.position.lng);
      };
    

    /**
     * Fetch and transform data
     * @returns {Promise<*[]>}
     */
    const fetchData = async () => {
        const persons = (await fetchPersons()).data;
        const data = [];
        for (const person of persons) {
            // parse person data and assign to corresponding fields
            const personData = { _id: person._id };
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
