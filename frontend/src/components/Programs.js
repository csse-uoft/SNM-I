import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../api/genericDataApi";
import { fetchSingleProvider } from "../api/providersApi";
import { fetchForAdvancedSearch } from "../api/advancedSearchApi";
import { getJson } from "../api/index";

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
      return serviceProvider
      return <Link color to={`/providers/${serviceProvider.split('_')[1]}`}>
        {serviceProvider}
      </Link>;
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
      if (program.serviceProvider) {
        const serviceProvider = (await getJson(`/api/providers/${program.serviceProvider.split('_')[1]}`));
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
        if (serviceProvider.provider.type === 'organization') {
          programData.serviceProvider = serviceProvider.provider.organization['characteristic_' + organizationNameCharacteristicId];
	} else if (serviceProvider.provider.type === 'volunteer') {
          const volunteerFirstName = serviceProvider.provider.volunteer['characteristic_' + volunteerFirstNameCharacteristicId];
          const volunteerLastName = serviceProvider.provider.volunteer['characteristic_' + volunteerLastNameCharacteristicId];
          programData.serviceProvider = volunteerLastName + ', ' + volunteerFirstName;
	} else {
          programData.serviceProvider = '#####'; // Should not happen.
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
