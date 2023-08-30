import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../api/genericDataApi";

const TYPE = 'serviceOccurrence';

const columnsWithoutOptions = [
  {
    label: 'Description',
    body: ({_id, description}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{description}</Link>;
    },
    sortBy: ({description}) => description,
  },
  {
    label: 'Service Name',
    body: ({occurrenceOf}) => occurrenceOf
  },
  // {
  //   label: 'Category',
  //   body: ({category}) => category
  // }
];

export default function ServiceOccurrences() {

  const nameFormatter = serviceOccurrence => serviceOccurrence._id;

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
    console.log(serviceOccurrences)
    const data = [];
    for (const serviceOccurrence of serviceOccurrences) {
      const serviceOccurrenceData = {_id: serviceOccurrence._id};
      // if (serviceOccurrence.characteristicOccurrences)
      //   for (const occ of serviceOccurrence.characteristicOccurrences) {
      //    if (occ.occurrenceOf?.name === 'Description') {
      //       serviceOccurrenceData.description = occ.dataStringValue;
      //     }
      //   }
      if(serviceOccurrence.description)
        serviceOccurrenceData.description = serviceOccurrence.description
      if(serviceOccurrence.occurrenceOf)
        serviceOccurrenceData.occurrenceOf = serviceOccurrence.occurrenceOf
      data.push(serviceOccurrenceData);
    }
    return data;
  };

  const deleteService = (id) => deleteSingleGeneric('serviceOccurrence', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Service Occurrences"}
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
