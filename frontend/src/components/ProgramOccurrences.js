import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../api/genericDataApi";
import { fetchForAdvancedSearch } from "../api/advancedSearchApi";
import { getAddressCharacteristicId } from "./shared/CharacteristicIds";

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

  const nameFormatter = (programOccurrence) => {
    if (programOccurrence.description) {
      return programOccurrence.description;
    } else {
      return 'Program Occurrence ' + programOccurrence._id;
    }
  };

  const linkFormatter = (programOccurrence) => {return `/${TYPE}/${programOccurrence._id}`;};

  const fetchData = async () => {
    var programNameCharacteristicId;
    const programCharacteristics = (await fetchForAdvancedSearch('program', 'characteristic')).data;
    for (const programCharacteristic of programCharacteristics) {
      if (programCharacteristic.name === 'Program Name') {
        programNameCharacteristicId = programCharacteristic._id;
      }
    }
 
    const programOccurrences = (await fetchMultipleGeneric(TYPE)).data;
    const addressCharacteristicId = await getAddressCharacteristicId(); // TODO: inefficient!
    const data = [];
    for (const programOccurrence of programOccurrences) {
      const programOccurrenceData = {_id: programOccurrence._id, address: {}};
      if (programOccurrence.description) {
        programOccurrenceData.description = programOccurrence.description;
      }
      if (programOccurrence.occurrenceOf) {
        programOccurrenceData.programID = programOccurrence.occurrenceOf.split('_')[1];
        const programData = (await fetchSingleGeneric('program', programOccurrenceData.programID)).data;
        programOccurrenceData.programName = programData['characteristic_' + programNameCharacteristicId];
      }
      if (programOccurrence.address) {
        programOccurrenceData.address = programOccurrence.address;
      }
      data.push(programOccurrenceData);
    }
    return data;
  };

  const deleteProgram = (id) => deleteSingleGeneric('programOccurrence', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Program Occurrences"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteProgram}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
