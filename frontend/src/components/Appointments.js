import React from 'react'
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchSingleGeneric, fetchMultipleGeneric } from "../api/genericDataApi";
import {getInstancesInClass} from "../api/dynamicFormApi";

const TYPE = 'appointments';


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
    body: ({datetime, dateType}) => {
      if (dateType === 'Date')
        return new Date(datetime).toLocaleDateString();
      else if (dateType === 'DateTime')
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

export default function Appointments() {

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
    const clients = {};
    await getInstancesInClass(':Client').then((res) => {
      Object.keys(res).forEach((key) => {
        const clientId = key.split('#')[1];
        clients[clientId] = res[key];
      }
      );
    });
    const persons = {};
    await getInstancesInClass('cids:Person').then((res) => {
      Object.keys(res).forEach((key) => {
        const personId = key.split('#')[1];
        persons[personId] = res[key];
      });
    });
    const data = [];
    console.log(appointmens);
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
            appointmentData.dateType = 'DateTime';
          } else if (occ.occurrenceOf?.name === 'Date') {
            appointmentData.datetime = occ.dataDateValue;
            appointmentData.dateType = 'Date';
          }
        }
      if (appointment.client){
        appointmentData.client = clients[appointment.client.slice(1)]
      }
      if (appointment.person){
        appointmentData.person = persons[appointment.person.slice(1)]
      } else if (appointment.user){
        // const userData = await fetchSingleGeneric('user', appointment.user);
        // console.log(userData);
      }
        
      data.push(appointmentData);
    }
    return data;
  }

  const deleteAppointment = (id) => deleteSingleGeneric('appointment', id);

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteAppointment}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
