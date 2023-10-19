import React from 'react';
import {Link} from "../shared"
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../../api/genericDataApi";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";

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
    body: ({referralStatus}) =>{
      return referralStatus
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

  const nameFormatter = service => service._id;

  const linkFormatter = service => `/${TYPE}/${service.id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const services = (await fetchMultipleGeneric('serviceRegistration')).data;
    const data = [];
    for (const service of services) {
      const serviceData = {_id: service._id};
      if (service.characteristicOccurrences)
        for (const occ of service.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Referral Type') {
            serviceData.referralType = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Referral Status') {
            serviceData.referralStatus = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Address') {
            const obj = (await fetchSingleGeneric("serviceRegistration", service._id)).data; // TODO: inefficient!
            serviceData.address = obj['characteristic_' + addressCharacteristicId];
          }
        }
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
