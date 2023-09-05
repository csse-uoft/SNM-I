import React from 'react';
import {Link} from './shared';
import {GenericPage} from "./shared";
import {deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric} from "../api/genericDataApi";
import {formatLocation} from '../helpers/location_helpers'

const TYPE = 'programs';

const columnsWithoutOptions = [
  {
    label: 'Name',
    body: ({_id, name}) => {
      return <Link color to={`/${TYPE}/${_id}`}>{name}</Link>;
    },
    sortBy: ({name}) => name,
  },
  {
    label: 'Provider',
    body: ({serviceProvider}) => {
      if (serviceProvider) {
        return <Link color to={`/providers/${serviceProvider.type}/${serviceProvider._id}`}>
          {serviceProvider.name}
        </Link>;
      } else {
        return "";
      }
    },
    sortBy: ({serviceProvider}) => serviceProvider?.name,
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
    },
    sortBy: ({manager}) => {
      if (manager) {
        if (manager.lastName && manager.firstName) {
          return manager.lastName + ", " + manager.firstName
        } else if (manager.lastName) {
          return manager.lastName;
        } else if (manager.firstName) {
          return manager.firstName;
        }
      }
      return "";
    }
  },
  {
    label: 'Services',
    body: ({_id, name}) => {
      return <Link color to={`/${TYPE}/${_id}/services`}>{name}</Link>;
    },
    sortBy: ({name}) => name,
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

  const nameFormatter = (program) => {
    return program.name;
  };

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
    const programs = (await fetchMultipleGeneric('program')).data;
    const data = [];
    for (const program of programs) {
      const programData = {_id: program._id, address: {}};
      if (program.address?.lat && program.address?.lng) {
        programData.address = {lat: program.address?.lat, lng: program.address?.lng}
      }
      if (program.characteristicOccurrences)
        for (const occ of program.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Program Name') {
            programData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Service Provider') {
            programData.provider = occ.objectValue;
          }
        }
      if (program.serviceProvider) {
        programData.serviceProvider = {
          _id: program.serviceProvider._id,
          name: program.serviceProvider.organization?.name || program.serviceProvider.volunteer?.name,
          type: program.serviceProvider.type
        }
      }
      if (program.manager) {
        programData.manager = {
          _id: program.manager._id,
          firstName: program.manager.firstName,
          lastName: program.manager.lastName,
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
