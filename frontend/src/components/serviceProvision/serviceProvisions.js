import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../../api/genericDataApi";
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
        return <Link color to={`/serviceOccurrence/${serviceOccurrence._id}/`}>{serviceOccurrence.description}</Link>;
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

  const nameFormatter = service => service._id;

  const linkFormatter = service => `/${TYPE}/${service.id}`;

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
          } else if (occ.occurrenceOf?.name === 'Address') {
            const obj = (await fetchSingleGeneric("serviceProvision", appointment._id)).data; // TODO: inefficient!
            appointmentData.address = obj['characteristic_' + addressCharacteristicId];
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
      deleteItem={deleteServiceProvision}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
