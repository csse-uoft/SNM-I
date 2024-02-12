import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../api/genericDataApi";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";

const TYPE = 'serviceWaitlist';

const columnsWithoutOptions = [
  {
    label: 'Service Name',
    body: ({service}) => <Link color to={`/${TYPE}/${service?._id}/edit`}>{service?.name}</Link>

  },
  {
    label: 'Clients Waitlisted',
    body: ({clients}) => clients ? clients.length : 0
  },
  // {
  //   label: 'Category',
  //   body: ({category}) => category
  // }
];

export default function ServiceWaitlists() {

  const nameFormatter = serviceWaitlist => {
    if (serviceWaitlist.description) {
      return serviceWaitlist.description;
    } else {
      return 'Service Waitlist ' + serviceWaitlist._id;
    }
  }

  const linkFormatter = serviceWaitlist => `/${TYPE}/${serviceWaitlist._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const serviceWaitlists = (await fetchMultipleGeneric(TYPE)).data;
    console.log(serviceWaitlists)
    const data = [];
    for (const serviceWaitlist of serviceWaitlists) {
      const serviceWaitlistData = {_id: serviceWaitlist._id};
      if (serviceWaitlist.clients)
        serviceWaitlistData.clients = serviceWaitlist.clients;
      if (serviceWaitlist.service)
        serviceWaitlistData.service = serviceWaitlist.service;
      data.push(serviceWaitlistData);
    }
    return data;
  };

  const deleteService = (id) => deleteSingleGeneric('serviceWaitlist', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Service Waitlists"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteService}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
