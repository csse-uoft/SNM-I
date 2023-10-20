import React from 'react';
import {Link} from './shared';
import {GenericPage} from "./shared";
import {deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric} from "../api/genericDataApi";
import {getServiceProviderName, getServiceProviderType} from "./shared/ServiceProviderInformation";
import {getServiceProviderNameCharacteristicIds} from "./shared/CharacteristicIds";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";

const TYPE = 'services';

const columnsWithoutOptions = [
  {
    label: 'Name',
    body: ({_id, name}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{name}</Link>;
    },
    sortBy: ({name}) => name,
  },
  {
    label: 'Provider',
    body: ({serviceProvider}) => {
      if (serviceProvider)
        return <Link color to={`/providers/${serviceProvider.type}/${serviceProvider._id}`}>
          {serviceProvider.name}
        </Link>;
    },
    sortBy: ({serviceProvider}) => serviceProvider.name,
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

export default function Services() {

  const nameFormatter = service => {
    if (service.name) {
      return service.name;
    } else {
      return 'Service ' + service._id;
    }
  }

  const linkFormatter = service => `/${TYPE}/${service._id}`;

  const fetchData = async () => {
    const services = (await fetchMultipleGeneric('service')).data;
    const addressCharacteristicId = await getAddressCharacteristicId();
    const characteristicIds = (await getServiceProviderNameCharacteristicIds());
    const data = [];
    for (const service of services) {
      const serviceData = {_id: service._id, address: {}};
      if (service.characteristicOccurrences)
        for (const occ of service.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Service Name') {
            serviceData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Service Provider') {
            serviceData.provider = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Address') {
            const obj = (await fetchSingleGeneric("service", service._id)).data; // TODO: inefficient!
            serviceData.address = obj['characteristic_' + addressCharacteristicId];
          }
        }
      if (service.serviceProvider)
        serviceData.serviceProvider = {
          _id: service.serviceProvider.split('_')[1],
          name: (await getServiceProviderName(service, characteristicIds)),
          type: (await getServiceProviderType(service))
        }
      data.push(serviceData);
    }
    return data;
  };

  const deleteService = (id) => deleteSingleGeneric('service', id);

  return (
    <GenericPage
      type={TYPE}
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
