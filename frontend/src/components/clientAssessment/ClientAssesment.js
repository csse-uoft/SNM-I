import React from 'react';
import { Link } from "../shared"
import { GenericPage } from "../shared";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric} from "../../api/genericDataApi";
import { getAddressCharacteristicId } from "../shared/CharacteristicIds";
import { formatName } from "../../helpers/formatters";

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
      if (client && client.id && client.name) {
        return <Link color to={`/clients/${client.id}`}>{client.name}</Link>;
      } else {
        // Handle the case where 'client' or its properties are undefined
        return <span>[NULL]</span>;
      }
      
    },
    sortBy: ({ client }) => client.name,
  },
];

export default function ClientAssessment() {

  const nameFormatter = (assessment) => {return 'Client Assessment ' + assessment._id;};

  const linkFormatter = (assessment) => {return `/${TYPE}/${assessment._id}/edit`;};

  const fetchData = async () => {
    console.log('fetching data');
    // get all clients data using function `VisualizeAppointment()` from `VisualizeAppointment.js`
    // using this function simplifies the code and makes no difference in performance
    const clientAssessments = (await fetchMultipleGeneric('clientAssessment')).data;
    const addressCharacteristicId = await getAddressCharacteristicId(); // TODO: inefficient!

    const data = [];
    for (const clientAssessment of clientAssessments) {
      const clientAssessmentData = { _id: clientAssessment._id, address: {} };
      if (clientAssessment.address) {
        clientAssessmentData.address = clientAssessment.address;
      }
      if (clientAssessment.client) {
        // get corresponding client data
        clientAssessmentData.client = {
          name: formatName(clientAssessment.client.firstName, clientAssessment.client.lastName, 'client', clientAssessment.client._id),
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
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
