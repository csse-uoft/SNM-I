import React from 'react';
import {Link} from "../shared"
import {GenericPage} from "../shared";
import {deleteSingleGeneric, fetchMultipleGeneric} from "../../api/genericDataApi";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";
import {getInstancesInClass} from '../../api/dynamicFormApi';

const TYPE = 'programRegistrations';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>;
    },
    sortBy: ({_id}) => Number(_id),
  },
  {
    label: 'Status',
    body: ({status}) =>{
      return status;
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

export default function ProgramRegistrations() {

  const nameFormatter = programRegistration => 'Program Registration ' + programRegistration._id;

  const linkFormatter = programRegistration => `/${TYPE}/${programRegistration._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const programs = (await fetchMultipleGeneric('programRegistration')).data;
    const statuses = await getInstancesInClass(':RegistrationStatus');
    const data = [];
    for (const program of programs) {
      const programData = {_id: program._id};
      if (program.characteristicOccurrences)
        for (const occ of program.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Registration Status') {
            programData.status = statuses[occ.dataStringValue];
          }
        }
      if (program.address)
        programData.address = program.address;
      data.push(programData);
    }
    return data;
  };

  const deleteProgramRegistration = (id) => deleteSingleGeneric('programRegistration', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Program Registrations"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteProgramRegistration}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
