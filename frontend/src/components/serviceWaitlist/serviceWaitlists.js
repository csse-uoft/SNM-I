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
      console.log(_id);
      console.log(<Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>);

      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    }
  },
  {
    label: 'Service Occurrence',
    body: ({serviceOccurrence}) => {
      console.log(serviceOccurrence);
      console.log(serviceOccurrence._id);
      return serviceOccurrence._id;
    }
  },
  {
    label: 'Waitlist Size',
    body: ({waitlist}) => {
      if (waitlist) {
        console.log(waitlist);
        console.log(waitlist.length);
        return waitlist.length;
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
      console.log(serviceWaitlist.serviceOccurrence);
      console.log(serviceWaitlist.waitlist);


      const serviceWaitlistData = {
              _id: serviceWaitlist._id,
              serviceOccurrence: serviceWaitlist.serviceOccurrence,
              waitlist: serviceWaitlist.waitlist
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
