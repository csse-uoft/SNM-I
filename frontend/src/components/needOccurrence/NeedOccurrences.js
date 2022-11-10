import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../../api/genericDataApi";

const TYPE = 'needOccurrences';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    }
  },
  {
    label: 'Client',
    body: ({client}) => {
      return client;
      // return  <Link color to={`/providers/${provider.id}`}>
      //   {formatProvider({provider})}
      // </Link>
    }
  },
  {
    label: 'Person',
    body: ({person}) => {
      return person;
      // return  <Link color to={`/providers/${provider.id}`}>
      //   {formatProvider({provider})}
      // </Link>
    }
  },
  {
    label: 'Datetime',
    body: ({datetime}) => {
      return new Date(datetime).toLocaleString();
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

export default function NeedOccurrences() {

  const nameFormatter = appointment => appointment.name;

  const generateMarkers = (data, pageNumber, rowsPerPage) => {
    return [];
    // TODO: verify this works as expected
    const currPageServices = data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageServices.map(service => ({
      position: {lat: Number(service.location.lat), lng: Number(service.location.lng)},
      title: service.name,
      link: `/${TYPE}/${service.id}`,
      content: service.desc,
    })).filter(service => service.position.lat && service.position.lng);
  };

  const fetchData = async () => {
    const appointmens = (await fetchMultipleGeneric('appointment')).data;
    const data = [];
    for (const appointment of appointmens) {
      const appointmentData = {_id: appointment._id};
      if (appointment.characteristicOccurrences)
        for (const occ of appointment.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Appointment Name') {
            appointmentData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Client') {
            appointmentData.client = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Person') {
            appointmentData.person = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Date and Time') {
            appointmentData.datetime = occ.dataDateValue;
          }
        }
      data.push(appointmentData);
    }
    return data;
  }

  const deleteNeedOccurrence = (id) => deleteSingleGeneric('needOccurrence', id);

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteNeedOccurrence}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
