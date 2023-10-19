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
    },
    sortBy: ({_id}) => Number(_id),
  },
  {
    label: 'Program Occurrence',
    body: ({programOccurrence}) => {
      if (programOccurrence) {
        return <Link color to={`/programOccurrence/${programOccurrence._id}/`}>{programOccurrence.description}</Link>;
      } else {
        return "";
      }
    },
    sortBy: ({programOccurrence}) => programOccurrence.description,
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
    },
    sortBy: ({startDate}) => Number(new Date(startDate)),
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
    },
    sortBy: ({endDate}) => Number(new Date(endDate)),
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

  const nameFormatter = program => program.name;

  const linkFormatter = program => `/${TYPE}/${program.id}`;

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
      title={"Program Provisions"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteProgramProvision}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
