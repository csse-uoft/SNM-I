import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../../api/genericDataApi";

const TYPE = 'programProvisions';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>;
    }
  },
  {
    label: 'Program Occurrence',
    body: ({programOccurrence}) => {
      if (programOccurrence) {
        return <Link color to={`/programOccurrence/${programOccurrence._id}/`}>{programOccurrence.description}</Link>;
      } else {
        return "";
      }
    }
  },
  {
    label: 'Start Date',
    body: ({startDate}) => {
      const startDateObj = new Date(startDate);
      if (isNaN(startDateObj)) {
        return "";
      } else {
        return startDateObj.toLocaleString();
      }
    }
  },
  {
    label: 'End Date',
    body: ({endDate}) => {
      const endDateObj = new Date(endDate);
      if (isNaN(endDateObj)) {
        return "";
      } else {
        return endDateObj.toLocaleString();
      }
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

export default function ProgramProvisions() {

  const nameFormatter = appointment => appointment.name;

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
    const appointmens = (await fetchMultipleGeneric('programProvision')).data;
    const data = [];
    for (const appointment of appointmens) {
      const appointmentData = {_id: appointment._id};
      if (appointment.characteristicOccurrences)
        for (const occ of appointment.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Start Date') {
            appointmentData.startDate = occ.dataDateValue;
          } else if (occ.occurrenceOf?.name === 'End Date') {
            appointmentData.endDate = occ.dataDateValue;
          }
        }
      if (appointment.programOccurrence)
        appointmentData.programOccurrence = appointment.programOccurrence
      data.push(appointmentData);
    }
    return data;
  }

  const deleteProgramProvision = (id) => deleteSingleGeneric('programProvision', id);

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteProgramProvision}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
