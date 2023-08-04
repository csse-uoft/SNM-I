import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../api/genericDataApi";
import { getServiceProviderNameCharacteristicIds, getServiceProviderName, getServiceProviderType } from "./shared/ServiceProviderInformation";

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
      return <Link color to={`/providers/${serviceProvider.type}/${serviceProvider._id}`}>
        {serviceProvider.name}
      </Link>;
    }
  },
  {
    label: 'Manager',
    body: ({manager}) => {
      if (manager) {
        if (manager.lastName && manager.firstName) {
          return <Link color to={`/user/${manager._id}/edit`}>{manager.lastName + ", " + manager.firstName}</Link>;
        } else if (manager.lastName) {
          return <Link color to={`/user/${manager._id}/edit`}>{manager.lastName}</Link>;
        } else if (manager.firstName) {
          return <Link color to={`/user/${manager._id}/edit`}>{manager.firstName}</Link>;
        } else {
          return <Link color to={`/user/${manager._id}/edit`}>{manager._id}</Link>;
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

  const nameFormatter = program => program.name;

  const generateMarkers = (data, pageNumber, rowsPerPage) => {
    return [];
    // TODO: verify this works as expected
    const currPagePrograms = data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPagePrograms.map(program => ({
      position: {lat: Number(program.location.lat), lng: Number(program.location.lng)},
      title: program.name,
      link: `/${TYPE}/${program.id}`,
      content: program.desc,
    })).filter(program => program.position.lat && program.position.lng);
  };

  const fetchData = async () => {
    const programs = (await fetchMultipleGeneric('program')).data;
    const characteristicIds = (await getServiceProviderNameCharacteristicIds());
    const data = [];
    for (const program of programs) {
      const programData = {_id: program._id};
      if (program.characteristicOccurrences)
        for (const occ of program.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Program Name') {
            programData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Service Provider') {
            programData.provider = occ.objectValue;
          }
        }
      if (program.serviceProvider)
        programData.serviceProvider = {
          _id: program.serviceProvider.split('_')[1],
          name: (await getServiceProviderName(program, characteristicIds)),
          type: (await getServiceProviderType(program))
        }
      if (program.manager)
        programData.manager = (await fetchSingleGeneric('person', program.manager)).data;
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
