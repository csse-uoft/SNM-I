import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../api/genericDataApi";
import { getServiceProviderName, getServiceProviderType } from "./shared/ServiceProviderInformation";
import { getServiceProviderNameCharacteristicIds, getPersonNameCharacteristicIds } from "./shared/CharacteristicIds";
import { getAddressCharacteristicId } from "./shared/CharacteristicIds";
import { formatLocation } from '../helpers/location_helpers'

const TYPE = 'programs';

const columnsWithoutOptions = [
  {
    label: 'Name',
    body: ({_id, name}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{name}</Link>;
    }
  },
  {
    label: 'Provider',
    body: ({serviceProvider}) =>{
      if (serviceProvider) {
        return <Link color to={`/providers/${serviceProvider.type}/${serviceProvider._id}`}>
          {serviceProvider.name}
        </Link>;
      } else {
        return "";
      }
    }
  },
  {
    label: 'Manager',
    body: ({manager}) => {
      if (manager) {
        if (manager.lastName && manager.firstName) {
          return <Link color to={`/person/${manager._id}`}>{manager.lastName + ", " + manager.firstName}</Link>;
        } else if (manager.lastName) {
          return <Link color to={`/person/${manager._id}`}>{manager.lastName}</Link>;
        } else if (manager.firstName) {
          return <Link color to={`/person/${manager._id}`}>{manager.firstName}</Link>;
        } else {
          return <Link color to={`/person/${manager._id}`}>{manager._id}</Link>;
        }
      } else {
        return "";
      }
    }
  },
  {
    label: 'Services',
    body: ({_id, name}) => {
      return <Link color to={`/${TYPE}/${_id}/services`}>Services</Link>;
    }
  },
  // {
  //   label: 'Description',
  //   body: ({desc}) => desc
  // },
  // {
  //   label: 'Category',
  //   body: ({category}) => category
  // }
];

export default function Programs() {

  const nameFormatter = (program) => {return program.name;};

  const generateMarkers = (data, pageNumber, rowsPerPage) => {
    // TODO: verify this works as expected
    const currPagePrograms = data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPagePrograms.map(program => ({
      position: {lat: Number(program.address.lat), lng: Number(program.address.lng)},
      title: nameFormatter(program),
      link: `/${TYPE}/${program._id}`,
      content: program.address && formatLocation(program.address),
    })).filter(program => program.position.lat && program.position.lng);
  };

  const fetchData = async () => {
    const programs = (await fetchMultipleGeneric('program')).data; // TODO: Does not contain address info
    const serviceProviderCharacteristicIds = (await getServiceProviderNameCharacteristicIds());
    const personCharacteristicIds = (await getPersonNameCharacteristicIds());
    const addressCharacteristicId = await getAddressCharacteristicId(); // TODO: inefficient!
    const data = [];
    for (const program of programs) {
      const programData = {_id: program._id, address: {}};
      if (program.characteristicOccurrences)
        for (const occ of program.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Program Name') {
            programData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Service Provider') {
            programData.provider = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Address') {
            const obj = (await fetchSingleGeneric("program", program._id)).data; // TODO: inefficient!
            programData.address = {
              lat: obj['characteristic_' + addressCharacteristicId].lat,
              lng: obj['characteristic_' + addressCharacteristicId].lng,
            };
           }
        }
      if (program.serviceProvider) {
        programData.serviceProvider = {
          _id: program.serviceProvider.split('_')[1],
          name: (await getServiceProviderName(program, serviceProviderCharacteristicIds)),
          type: (await getServiceProviderType(program))
        }
      }
      if (program.manager) {
        const manager = (await fetchSingleGeneric('person', program.manager.split('_')[1])).data;
        programData.manager = {
          _id: program.manager.split('_')[1],
          firstName: manager['characteristic_' + personCharacteristicIds.personFirstName],
          lastName: manager['characteristic_' + personCharacteristicIds.personLastName]
	}
      }
      data.push(programData);
    }
    return data;
  };

  const deleteProgram = (id) => deleteSingleGeneric('program', id);

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteProgram}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
