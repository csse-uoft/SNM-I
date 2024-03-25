import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../../api/genericDataApi";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";

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
    label: 'Program Occurrence',
    body: ({programOccurrence}) => {
      console.log(programOccurrence);
      console.log(programOccurrence._id);
      return programOccurrence._id;
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
      console.log(programWaitlist.programOccurrence);
      console.log(programWaitlist.waitlist);


      const programWaitlistData = {
              _id: programWaitlist._id,
              programOccurrence: programWaitlist.programOccurrence,
              waitlist: programWaitlist.waitlist
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
