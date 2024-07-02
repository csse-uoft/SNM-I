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
    const programOccurrences = (await fetchMultipleGeneric(TYPE)).data;
    const data = [];
    for (const programOccurrence of programOccurrences) {
      const programOccurrenceData = {_id: programOccurrence._id, address: {}};
      if (programOccurrence.description) {
        programOccurrenceData.description = programOccurrence.description;
      }
      if (programOccurrence.occurrenceOf) {
        programOccurrenceData.programID = programOccurrence.occurrenceOf._id;
        programOccurrenceData.programName = programOccurrence.occurrenceOf.name;
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
