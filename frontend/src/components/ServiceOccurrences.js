import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../api/genericDataApi";

const TYPE = 'serviceOccurrences';

const columnsWithoutOptions = [
  {
    label: 'Occurrence Of',
    body: ({_id, service}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{service}</Link>;
    }
  },
  // {
  //   label: 'Provider',
  //   body: ({provider}) => {
  //     return provider;
  //     return <Link color to={`/providers/${provider.split('_')[1]}`}>
  //       {provider}
  //     </Link>;
  //   }
  // },
  // {
  //   label: 'Description',
  //   body: ({desc}) => desc
  // },
  // {
  //   label: 'Category',
  //   body: ({category}) => category
  // }
];

export default function ServiceOccurrences() {

  const nameFormatter = service => service.name;

  const generateMarkers = (data, pageNumber, rowsPerPage) => {
    return [];
    // TODO: verify this works as expected
    const currPageServices = data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageServices.map(service => ({
      position: {lat: Number(service.location.lat), lng: Number(service.location.lng)},
      title: service.name,
      link: `/${TYPE}/${service.id}`,
      content: service.desc,
    })).filter(service => service.position.lat && service.position.lng);
  };

  const fetchData = async () => {
    const serviceOccurrences = (await fetchMultipleGeneric(TYPE)).data;
    const data = [];
    for (const serviceOccurrence of serviceOccurrences) {
      const serviceOccurrenceData = {_id: serviceOccurrence._id};
      if (serviceOccurrence.characteristicOccurrences)
        for (const occ of serviceOccurrence.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Service Name') {
            serviceOccurrenceData.name = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Service Provider') {
            serviceOccurrenceData.provider = occ.objectValue;
          }
        }
      data.push(serviceOccurrenceData);
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
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
