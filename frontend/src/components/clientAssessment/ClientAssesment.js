import React from 'react';
import { Link } from "../shared"
import { GenericPage } from "../shared";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../../api/genericDataApi";

const TYPE = 'clientAssessment';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({ _id }) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>;
    }
  },
  {
    label: 'Client',
    body: ({ client }) => {
      return client;
      // return  <Link color to={`/providers/${provider.id}`}>
      //   {formatProvider({provider})}
      // </Link>
    }
  },
];

export default function ClientAssessment() {

  const nameFormatter = service => service.name; // ?

  const generateMarkers = (data, pageNumber, rowsPerPage) => {
    return [];
  };

  const fetchData = async () => {
    // get all clients data using function `VisualizeAppointment()` from `VisualizeAppointment.js`
    // using this function simplifies the code and makes no difference in performance
    const clientAssessments = (await fetchMultipleGeneric('clientAssessment')).data;
    const clients = {};
    await getInstancesInClass(':Client').then((res) => {
      Object.keys(res).forEach((key) => {
        const clientId = key.split('#')[1];
        clients[clientId] = res[key];
      }
      );
    });
    const persons = {};
    // get all persons data
    await getInstancesInClass('cids:Person').then((res) => {
      Object.keys(res).forEach((key) => {
        const personId = key.split('#')[1];
        persons[personId] = res[key];
      });
    });

    // const clientAssessments = (await fetchMultipleGeneric('clientAssessment')).data;
    const data = [];
    for (const clientAssessment of clientAssessments) {
      const clientAssessmentData = { _id: clientAssessment._id };

      if (clientAssessment.characteristicOccurrences)
        for (const occ of clientAssessment.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Client') {
            clientAssessmentData.client = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Person') {
            clientAssessmentData.person = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'UserAccount') {
            clientAssessmentData.userAccount = occ.objectValue;
          } else if (occ.occurrenceOf?.name === 'Outcome') {
            clientAssessmentData.outcome = occ.objectValue;
          }
        }
      if (clientAssessment.client) {
        // get corresponding client data
        clientAssessmentData.client = clients[clientAssessment.client.slice(1)]
      }
      if (clientAssessment.person) {
        // get corresponding person data
        clientAssessmentData.person = persons[clientAssessment.person.slice(1)]
      }
      if (clientAssessment.user) {
        // const userData = await fetchSingleGeneric('user', appointment.user);
        // console.log(userData);
      }

      data.push(clientAssessmentData);
    }
    return data;
  };

  const deleteClientAssessment = (id) => deleteSingleGeneric('clientAssessment', id);

  return (
    <GenericPage
      type={TYPE}
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
