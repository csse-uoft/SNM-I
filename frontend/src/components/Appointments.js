import React from 'react'
import {Link} from './shared';
import {GenericPage} from "./shared";
import {deleteSingleGeneric, fetchSingleGeneric, fetchMultipleGeneric} from "../api/genericDataApi";
import {getInstancesInClass} from "../api/dynamicFormApi";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";

const TYPE = 'appointments';


const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    },
    sortBy: ({_id}) => Number(_id),
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
    },
    sortBy: ({datetime, dateType}) => {
      return Number(new Date(datetime));
    },
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
    // TODO: verify this works as expected 
    const currPageAppointments = data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageAppointments.map(appointment => ({
      position: (appointment.address?.lat && appointment.address?.lng)
        ? {lat: Number(appointment.address.lat), lng: Number(appointment.address.lng)}
        : {...appointment.address},
      title: 'Appointment ' + appointment._id,
      link: `/${TYPE}/${appointment._id}`,
    })).filter(appointment => (appointment.position?.lat && appointment.position?.lng) || (appointment.position?.streetName && appointment.position?.city))
  };

  const fetchData = async () => {
    // get all appointments data
    const appointments = (await fetchMultipleGeneric('appointment')).data;
    const addressCharacteristicId = await getAddressCharacteristicId();
    const clients = {};
    // get all clients data
    await getInstancesInClass(':Client').then((res) => {
      Object.keys(res).forEach((key) => {
          const clientId = key.split('#')[1];
          clients[clientId] = res[key];
        }
      );
    });
    const persons = {};
    // get all persons data
    await getInstancesInClass('cids:Person').then((res) => {
      Object.keys(res).forEach((key) => {
        const personId = key.split('#')[1];
        persons[personId] = res[key];
      });
    });
    const data = [];
    for (const appointment of appointments) {
      //parse appointment data and assgin to corresponding fields
      const appointmentData = {_id: appointment._id, address: {}};
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
          } else if (occ.occurrenceOf?.name === 'Address') {
            const appointmentObj = (await fetchSingleGeneric("appointment", appointment._id)).data; // TODO: inefficient!
            appointmentData.address = appointmentObj['characteristic_' + addressCharacteristicId];
          }
        }
      if (appointment.client) {
        // get corresponding client data
        appointmentData.client = clients[appointment.client.split('#')[1]]
      }
      if (appointment.person) {
        // get corresponding person data
        appointmentData.person = persons[appointment.person.split('#')[1]]
      } else if (appointment.user) {
        // const userData = await fetchSingleGeneric('user', appointment.user);
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
