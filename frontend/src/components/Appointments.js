import React from 'react'
import {Link} from './shared';
import {GenericPage} from "./shared";
import {deleteSingleGeneric, fetchSingleGeneric, fetchMultipleGeneric} from "../api/genericDataApi";
import {getUserProfileById} from "../api/userApi";
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
    label: 'Status',
    body: ({appointmentStatus}) => {
      return appointmentStatus;
    }
  },
  {
    label: 'Client',
    body: ({client}) => {
      if (client) {
        return <Link color to={`/clients/${client._id.split('_')[1]}`}>{client.name || ':' + client._id}</Link>;
      }
    }
  },
  {
    label: 'Person',
    body: ({person}) => {
      if (person) {
        return <Link color to={`/person/${person._id.split('_')[1]}`}>{person.name || ':' + person._id}</Link>;
      }
    }
  },
  {
    label: 'User',
    body: ({user}) => {
      if (user) {
        return <Link color to={`/users/${user._id.split('_')[1]}`}>{user.name || ':' + user._id}</Link>;
      }
    }
  },
  {
    label: 'Datetime',
    body: ({datetime, dateType}) => {
      if (dateType === 'Date')
        return new Date(datetime).toLocaleDateString();
      else if (dateType === 'DateTime')
        return new Date(datetime).toLocaleString();
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

  const nameFormatter = appointment => 'Appointment ' + appointment._id;

  const linkFormatter = appointment => `/${TYPE}/${appointment._id}`;

  const fetchData = async () => {
    // get all appointments data
    const appointments = (await fetchMultipleGeneric('appointment')).data;
    const addressCharacteristicId = await getAddressCharacteristicId();
    const statuses = await getInstancesInClass(':AppointmentStatus');
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
          } else if (occ.occurrenceOf?.name === 'Appointment Status') {
            appointmentData.appointmentStatus = statuses[occ.dataStringValue];
          }
        }
      if (appointment.client) {
        // get corresponding client data
        appointmentData.client = {
          _id: appointment.client.split('#')[1],
          name: clients[appointment.client.split('#')[1]
                || ':' + appointment.client.split('#')[1]]
        };
      }
      if (appointment.person) {
        // get corresponding person data
        appointmentData.person = {
          _id: appointment.person.split('#')[1],
          name: persons[appointment.person.split('#')[1]
                || ':' + appointment.person.split('#')[1]]
        };
      }
      if (appointment.user) {
        const userData = await getUserProfileById(appointment.user.split('_')[1]);
        appointmentData.user = {
          _id: appointment.user.split('#')[1],
          name: userData.primaryContact
                ? userData.primaryContact.lastName + ', ' + userData.primaryContact.firstName
                : ':' + appointment.user.split('#')[1],
        };
      }
      if (appointment.address) {
        appointmentData.address = appointment.address;
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
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
