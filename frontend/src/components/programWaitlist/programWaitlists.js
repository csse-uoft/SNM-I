import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../../api/genericDataApi";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";
import client from '../../../../backend/programs/characteristics/predefined/client';

const TYPE = 'programWaitlists';

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
    label: 'ProgramOccurrence',
    body: ({ProgramOccurrence}) => {
      console.log(programOccurrence);
      console.log(programOccurrence._id);
      return programOccurrence._id;
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

export default function ProgramWaitlists() {

  const nameFormatter = programWaitlist => 'Program Waitlist' + programWaitlist._id;

  const linkFormatter = needOccurrence => `/${TYPE}/${programWaitlist._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const programWaitlists = (await fetchMultipleGeneric('programWatilist')).data;
    const data = [];
    for (const programWaitlist of programWaitlists) {
      console.log(programWaitlist._id);
      console.log(programWaitlist.programOccurrence._id);
      console.log(programWaitlist.clients);


      const programWaitlistData = {
              _id: programWaitlist._id,
              programOccurrence: programWaitlist.programOccurrence,
              clients: programWaitlist.clients
      };
      data.push(programWaitlistData);
      console.log(data)
    }
    return data;
  }

  const deleteProgramWaitlist = (id) => deleteSingleGeneric('programWaitlist', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Program Waitlist"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteProgramWaitlist}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
