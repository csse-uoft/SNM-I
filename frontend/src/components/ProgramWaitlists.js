import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../api/genericDataApi";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";

const TYPE = 'programWaitlist';

const columnsWithoutOptions = [
  {
    label: 'Program Occurrence ID',
    body: ({programOccurrence}) => <Link color to={`/${TYPE}/${programOccurrence?._id}/edit`}>{programOccurrence?._id}</Link>

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

export default function ProgramWaitlists() {

  const nameFormatter = programWaitlist => {
    if (programWaitlist.description) {
      return programWaitlist.description;
    } else {
      return 'Program Waitlist ' + programWaitlist._id;
    }
  }

  const linkFormatter = programWaitlist => `/${TYPE}/${programWaitlist._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const programWaitlists = (await fetchMultipleGeneric(TYPE)).data;
    console.log(programWaitlists)
    const data = [];
    for (const programWaitlist of programWaitlists) {
      const programWaitlistData = {_id: programWaitlist._id};
      if (programWaitlist.waitlist)
        programWaitlistData.waitlist = programWaitlist.waitlist;
      if (programWaitlist.programOccurrence)
        programWaitlistData.programOccurrence = programWaitlist.programOccurrence;
      data.push(programWaitlistData);
    }
    return data;
  };

  const deleteService = (id) => deleteSingleGeneric('programWaitlist', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Program Waitlists"}
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
