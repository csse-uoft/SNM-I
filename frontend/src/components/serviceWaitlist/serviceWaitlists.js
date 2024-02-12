import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../../api/genericDataApi";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";
import client from '../../../../backend/services/characteristics/predefined/client';

const TYPE = 'serviceWaitlists';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      console.log(_id);
      console.log(<Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>);

      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    }
  },
  {
    label: 'Service',
    body: ({service}) => {
      console.log(service);
      console.log(service.name);
      return service.name;
    }
  },
  {
    label: 'Waitlist Size',
    body: ({clients}) => {
      if (clients) {
        console.log(clients);
        console.log(clients.length);
        return clients.length;
      } else {
        return "";
      }
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

export default function ServiceWaitlists() {

  const nameFormatter = serviceWaitlist => 'Service Waitlist' + serviceWaitlist._id;

  const linkFormatter = needOccurrence => `/${TYPE}/${serviceWaitlist._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const serviceWaitlists = (await fetchMultipleGeneric('serviceWatilist')).data;
    const data = [];
    for (const serviceWaitlist of serviceWaitlists) {
      console.log(serviceWaitlist._id);
      console.log(serviceWaitlist.service);
      console.log(serviceWaitlist.clients);


      const serviceWaitlistData = {
              _id: serviceWaitlist._id,
              service: serviceWaitlist.service,
              clients: serviceWaitlist.clients
      };
      data.push(serviceWaitlistData);
      console.log(data)
    }
    return data;
  }

  const deleteServiceWaitlist = (id) => deleteSingleGeneric('serviceWaitlist', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Service Waitlist"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteServiceWaitlist}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
