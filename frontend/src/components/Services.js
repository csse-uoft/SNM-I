import React from 'react';
import {Link} from './shared';
import {GenericPage} from "./shared";
import {deleteSingleGeneric, fetchMultipleGeneric, fetchSearchGeneric, fetchSingleGeneric} from "../api/genericDataApi";
import {getServiceProviderName, getServiceProviderType} from "./shared/ServiceProviderInformation";
import {getServiceProviderNameCharacteristicIds} from "./shared/CharacteristicIds";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";
import {formatProviderName} from "./Providers";
import {getInstancesInClass} from '../api/dynamicFormApi';
import {formatLocation} from '../helpers/location_helpers'
import {fetchForServiceAdvancedSearch} from "../api/advancedSearchApi";

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
    label: 'Shareability',
    body: ({shareability}) => {
      return shareability;
    },
    sortBy: ({shareability}) => shareability,
  },
  {
    label: 'Provider',
    body: ({serviceProvider}) => {
      if (serviceProvider)
        return <Link color to={`/providers/${serviceProvider.type}/${serviceProvider._id}`}>
          {formatProviderName(serviceProvider)}
        </Link>;
    },
    sortBy: ({serviceProvider}) => serviceProvider ? formatProviderName(serviceProvider) : '',
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
    const shareabilities = await getInstancesInClass(':Shareability');
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
          }
        }
      if (service.serviceProvider) {
        console.log(JSON.stringify(service.serviceProvider));
        serviceData.serviceProvider = {
          _id: service.serviceProvider._id,
          name: service.serviceProvider.organization?.name,
          lastName: service.serviceProvider.volunteer?.lastName,
          firstName: service.serviceProvider.volunteer?.firstName,
          type: service.serviceProvider.type
        }
      }
      if (service.serviceProvider?.organization?.address) {
        serviceData.address = service.serviceProvider.organization.address;
      } else if (service.serviceProvider?.volunteer?.address) {
        serviceData.address = service.serviceProvider.volunteer.address;
      }

      if (service.shareability) {
        serviceData.shareability = shareabilities[service.shareability];
        if (service.partnerOrganization) {
          serviceData.partnerOrganizations = service.partnerOrganization;
        }
      }
      data.push(serviceData);
    }
    return data;
  };

  const searchData = async(searchitem) =>{
    const services = (await fetchSearchGeneric('service', searchitem)).data;
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
            const serviceObj = (await fetchSingleGeneric("service", service._id)).data; // TODO: inefficient!
            serviceData.address = {
              lat: serviceObj['characteristic_' + addressCharacteristicId].lat,
              lng: serviceObj['characteristic_' + addressCharacteristicId].lng,
            };
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

  }

  const deleteService = (id) => deleteSingleGeneric('service', id);

  const advancedSearchService = async (searchitems) => {
    const services = (await fetchForServiceAdvancedSearch(searchitems)).data;
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
            const serviceObj = (await fetchSingleGeneric("service", service._id)).data; // TODO: inefficient!
            serviceData.address = {
              lat: serviceObj['characteristic_' + addressCharacteristicId].lat,
              lng: serviceObj['characteristic_' + addressCharacteristicId].lng,
            };
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

  }

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      searchData = {searchData}
      advancedSearch = {advancedSearchService}
      deleteItem={deleteService}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
