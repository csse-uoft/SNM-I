import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../../api/genericDataApi";

const TYPE = 'programProvisions';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    }
  },
  {
    label: 'Program Occurrence',
    body: ({programOccurrence}) => {
      return programOccurrence;
      // return  <Link color to={`/providers/${provider.id}`}>
      //   {formatProvider({provider})}
      // </Link>
    }
  },
  {
    label: 'Start Date',
    body: ({startDate}) => {
      return new Date(startDate).toLocaleString();
      // return  <Link color to={`/providers/${provider.id}`}>
      //   {formatProvider({provider})}
      // </Link>
    }
  },
  {
    label: 'End Date',
    body: ({endDate}) => {
      return new Date(endDate).toLocaleString();
      // return  <Link color to={`/providers/${provider.id}`}>
      //   {formatProvider({provider})}
      // </Link>
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
