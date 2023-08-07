import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../../api/genericDataApi";

const TYPE = 'outcomeOccurrences';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    }
  },
  {
    label: 'Client',
    body: ({client}) => {
      return client;
    }
  },
  {
    label: 'Person',
    body: ({person}) => {
      return person;
    }
  },
  {
    label: 'Start Date',
    body: ({datetime}) => {
      return datetime && new Date(datetime).toLocaleString();
    }
  },
  {
    label: 'End Date',
    body: ({datetime}) => {
      return datetime && new Date(datetime).toLocaleString();
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

export default function OutcomeOccurrences() {

  const nameFormatter = outcomeOccurrence => outcomeOccurrence._id;

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
    const outcomeOccurrences = (await fetchMultipleGeneric('outcomeOccurrence')).data;
    const data = [];
    for (const outcomeOccurrence of outcomeOccurrences) {
      const outcomeOccurrenceData = {_id: outcomeOccurrence._id};
      if (outcomeOccurrence.characteristicOccurrences)
        for (const occ of outcomeOccurrence.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Start Date') {
            outcomeOccurrenceData.name = occ.dataDateValue;
          } else if (occ.occurrenceOf?.name === 'End Date') {
            outcomeOccurrenceData.client = occ.dataDateValue;
          }
        }
      data.push(outcomeOccurrenceData);
    }
    return data;
  }

  const deleteOutcomeOccurrence = (id) => deleteSingleGeneric('outcomeOccurrence', id);

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteOutcomeOccurrence}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
