import React from 'react';
import {Link} from "../shared"
import {GenericPage } from "../shared";
import {deleteSingleGeneric, fetchMultipleGeneric} from "../../api/genericDataApi";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";
import {getInstancesInClass} from '../../api/dynamicFormApi';

const TYPE = 'serviceRegistrations';

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

export default function ServiceRegistrations() {

  const nameFormatter = serviceRegistration => 'Service Registration ' + serviceRegistration._id;

  const linkFormatter = serviceRegistration => `/${TYPE}/${serviceRegistration._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const services = (await fetchMultipleGeneric('serviceRegistration')).data;
    const statuses = await getInstancesInClass(':RegistrationStatus');
    const data = [];
    for (const service of services) {
      const serviceData = {_id: service._id};
      if (service.characteristicOccurrences)
        for (const occ of service.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Registration Status') {
            serviceData.status = statuses[occ.dataStringValue];
          }
        }
      if (service.address)
        serviceData.address = service.address;
      data.push(serviceData);
    }
    return data;
  };

  const deleteServiceRegistration = (id) => deleteSingleGeneric('serviceRegistration', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Service Registrations"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteServiceRegistration}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
