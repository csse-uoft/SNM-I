import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSearchGeneric, fetchSingleGeneric } from "../../api/genericDataApi";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";

const TYPE = 'serviceProvisions';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    },
    sortBy: ({_id}) => Number(_id),
  },
  {
    label: 'Service Occurrence',
    body: ({serviceOccurrence}) => {
      if (serviceOccurrence) {
        if (serviceOccurrence.description) {
          return <Link color to={`/serviceOccurrence/${serviceOccurrence._id}/`}>{serviceOccurrence.description}</Link>;
        } else {
          return <Link color to={`/serviceOccurrence/${serviceOccurrence._id}/`}>{'Service Occurrence ' + serviceOccurrence._id}</Link>;
        }
      } else {
        return "";
      }
    },
    sortBy: ({serviceOccurrence}) => Number(serviceOccurrence.description),
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

export default function ServiceProvisions() {

  const nameFormatter = serviceProvision => 'Service Provision ' + serviceProvision._id;

  const linkFormatter = serviceProvision => `/${TYPE}/${serviceProvision._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const appointmens = (await fetchMultipleGeneric('serviceProvision')).data;
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
      if (appointment.serviceOccurrence)
        appointmentData.serviceOccurrence = appointment.serviceOccurrence
      if (appointment.address)
        appointmentData.address = appointment.address;
      data.push(appointmentData);
    }
    return data;
  }


  const searchData = async (searchitem) => {
    const appointmens = (await fetchSearchGeneric('serviceProvision', searchitem)).data;
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
      if (appointment.serviceOccurrence)
        appointmentData.serviceOccurrence = appointment.serviceOccurrence
      data.push(appointmentData);
    }
    return data;
  }

  const deleteServiceProvision = (id) => deleteSingleGeneric('serviceProvision', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Service Provisions"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      searchData = {searchData}
      deleteItem={deleteServiceProvision}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
