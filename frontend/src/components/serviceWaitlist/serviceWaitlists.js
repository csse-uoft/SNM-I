import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../../api/genericDataApi";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";

const TYPE = 'serviceWaitlists';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    }
  },
  {
    label: 'Service',
    body: ({service}) => {
      return <Link color to={`/${TYPE}/${service}/edit`}>{service}</Link>
    }
  },
  {
    label: 'Waitlist Size',
    body: ({clients}) => {
      if (clients) {
        return <Link color to={`/need/${clients}/edit`}>{clients}</Link>;
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
