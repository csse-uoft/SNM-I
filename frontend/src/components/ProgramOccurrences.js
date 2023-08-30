import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../api/genericDataApi";
import { fetchForAdvancedSearch } from "../api/advancedSearchApi";
import { getAddressCharacteristicId } from "./shared/CharacteristicIds";
import { formatLocation } from '../helpers/location_helpers'

const TYPE = 'programOccurrence';

const columnsWithoutOptions = [
  {
    label: 'Description',
    body: ({_id, description}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{description}</Link>;
    },
    sortBy: ({description}) => description,
  },
  {
    label: 'Program Name',
    body: ({programName, programID}) => {
      return <Link color to={`/programs/${programID}/`}>{programName}</Link>;
    },
    sortBy: ({programName}) => programName,
  },
  // {
  //   label: 'Category',
  //   body: ({category}) => category
  // }
];

export default function ProgramOccurrences() {

  const nameFormatter = (programOccurrence) => {return programOccurrence.description;};

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
    var programNameCharacteristicId;
    const programCharacteristics = (await fetchForAdvancedSearch('program', 'characteristic')).data;
    for (const programCharacteristic of programCharacteristics) {
      if (programCharacteristic.name === 'Program Name') {
        programNameCharacteristicId = programCharacteristic._id;
      }
    }
 
    const programOccurrences = (await fetchMultipleGeneric(TYPE)).data; // TODO: Does not contain address info
    const addressCharacteristicId = await getAddressCharacteristicId(); // TODO: inefficient!
    const data = [];
    for (const programOccurrence of programOccurrences) {
      const programOccurrenceData = {_id: programOccurrence._id, address: {}};
       if (programOccurrence.characteristicOccurrences)
         for (const occ of programOccurrence.characteristicOccurrences) {
           if (occ.occurrenceOf?.name === 'Address') {
             const obj = (await fetchSingleGeneric("programOccurrence", programOccurrence._id)).data; // TODO: inefficient!
             programOccurrenceData.address = {
               lat: obj['characteristic_' + addressCharacteristicId].lat,
               lng: obj['characteristic_' + addressCharacteristicId].lng,
             };
            }
         }
      if (programOccurrence.description) {
        programOccurrenceData.description = programOccurrence.description;
      }
      if (programOccurrence.occurrenceOf) {
        programOccurrenceData.programID = programOccurrence.occurrenceOf.split('_')[1];
        const programData = (await fetchSingleGeneric('program', programOccurrenceData.programID)).data;
        programOccurrenceData.programName = programData['characteristic_' + programNameCharacteristicId];
      }
      data.push(programOccurrenceData);
    }
    return data;
  };

  const deleteProgram = (id) => deleteSingleGeneric('programOccurrence', id);

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
