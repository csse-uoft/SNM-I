import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import {deleteSingleGeneric, fetchMultipleGeneric, fetchSearchGeneric} from "../../api/genericDataApi";

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
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
