import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../api/genericDataApi";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";

const TYPE = 'serviceWaitlist';

const columnsWithoutOptions = [
  {
    label: 'Service Occurrence ID',
    body: ({serviceOccurrence}) => <Link color to={`/${TYPE}/${service?._id}/edit`}>{service?._id}</Link>

  },
  {
    label: 'Clients Waitlisted',
    body: ({waitlist}) => waitlist ? waitlist.length : 0
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
      if (serviceWaitlist.waitlist)
        serviceWaitlistData.waitlist = serviceWaitlist.waitlist;
      if (serviceWaitlist.serviceOccurrence)
        serviceWaitlistData.serviceOccurrence = serviceWaitlist.serviceOccurrence;
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
