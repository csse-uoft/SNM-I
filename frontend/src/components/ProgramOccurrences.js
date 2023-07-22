import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../api/genericDataApi";

const TYPE = 'programOccurrence';

const columnsWithoutOptions = [
  {
    label: 'Description',
    body: ({_id, description}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{description}</Link>;
    }
  },
  {
    label: 'Program Name',
    body: ({occurrenceOf}) => occurrenceOf
  },
  // {
  //   label: 'Category',
  //   body: ({category}) => category
  // }
];

export default function ProgramOccurrences() {

  const nameFormatter = programOccurrence => programOccurrence._id;

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
    const programOccurrences = (await fetchMultipleGeneric(TYPE)).data;
    console.log(programOccurrences)
    const data = [];
    for (const programOccurrence of programOccurrences) {
      const programOccurrenceData = {_id: programOccurrence._id};
      // if (programOccurrence.characteristicOccurrences)
      //   for (const occ of programOccurrence.characteristicOccurrences) {
      //    if (occ.occurrenceOf?.name === 'Description') {
      //       programOccurrenceData.description = occ.dataStringValue;
      //     }
      //   }
      if(programOccurrence.description)
        programOccurrenceData.description = programOccurrence.description
      if(programOccurrence.occurrenceOf)
        programOccurrenceData.occurrenceOf = programOccurrence.occurrenceOf
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
