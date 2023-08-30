import React from 'react';
import { Link } from "../shared"
import { GenericPage } from "../shared";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../../api/genericDataApi";
import { fetchSingleGeneric } from "../../api/genericDataApi";
import { getAddressCharacteristicId } from "../shared/CharacteristicIds";
import { formatLocation } from '../../helpers/location_helpers'

const TYPE = 'clientAssessment';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({ _id }) => {
      return <Link color to={`/${TYPE}/${_id}`}>{_id}</Link>;
    },
    sortBy: ({ _id }) => Number(_id),
  },
  {
    label: 'Client',
    body: ({ client }) => {
      return <Link color to={`/clients/${client.id}`}>{client.name}</Link>;
    },
    sortBy: ({ client }) => client.name,
  },
];

export default function ClientAssessment() {

  const nameFormatter = (assessment) => {return assessment._id;};

  const generateMarkers = (data, pageNumber, rowsPerPage) => {
    // TODO: verify this works as expected
    const currPageData = data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
    return currPageData.map(obj => ({
      position: {lat: Number(obj.address.lat), lng: Number(obj.address.lng)},
      title: nameFormatter(obj),
      link: `/${TYPE}/${obj._id}/edit`,
      content: obj.address && formatLocation(obj.address),
    })).filter(obj => obj.position.lat && obj.position.lng);
  };

  const fetchData = async () => {
    console.log('fetching data');
    // get all clients data using function `VisualizeAppointment()` from `VisualizeAppointment.js`
    // using this function simplifies the code and makes no difference in performance
    const clientAssessments = (await fetchMultipleGeneric('clientAssessment')).data; // TODO: Does not contain address info
    const addressCharacteristicId = await getAddressCharacteristicId(); // TODO: inefficient!

    const data = [];
    for (const clientAssessment of clientAssessments) {
      const clientAssessmentData = { _id: clientAssessment._id, address: {} };
      if (clientAssessment.characteristicOccurrences)
        for (const occ of clientAssessment.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Address') {
            const obj = (await fetchSingleGeneric("clientAssessment", clientAssessment._id)).data; // TODO: inefficient!
            clientAssessmentData.address = {
              lat: obj['characteristic_' + addressCharacteristicId].lat,
              lng: obj['characteristic_' + addressCharacteristicId].lng,
            };
          }
        }
      if (clientAssessment.client) {
        // get corresponding client data
        clientAssessmentData.client = {
          name: clientAssessment.client.firstName + ' ' + clientAssessment.client.lastName,
          id: clientAssessment.client._id
        }
      }

      data.push(clientAssessmentData);
    }
    console.log(data)
    return data;
  };

  const deleteClientAssessment = (id) => deleteSingleGeneric('clientAssessment', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Client Assessment"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteClientAssessment}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
