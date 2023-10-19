import React from 'react';
import { Link } from './shared';
import { GenericPage } from "./shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../api/genericDataApi";
import {getAddressCharacteristicId} from "./shared/CharacteristicIds";

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

  const nameFormatter = serviceOccurrence => serviceOccurrence.description;

  const linkFormatter = serviceOccurrence => `/${TYPE}/${serviceOccurrence._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
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
      if (serviceOccurrence.characteristicOccurrences)
        for (const occ of serviceOccurrence.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Address') {
            const obj = (await fetchSingleGeneric("serviceOccurrence", serviceOccurrence._id)).data; // TODO: inefficient!
            serviceOccurrenceData.address = obj['characteristic_' + addressCharacteristicId];
          }
        }
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
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
