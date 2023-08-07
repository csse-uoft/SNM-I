import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../../api/genericDataApi";
import { getInstancesInClass } from "../../api/dynamicFormApi";

const TYPE = 'outcomeOccurrences';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    }
  },
  {
    label: 'Person',
    body: ({person}) => {
      if (person) {
        return person;
      } else {
        return "";
      }
    }
  },
  {
    label: 'Start Date',
    body: ({startDate}) => {
      const startDateObj = new Date(startDate);
      if (isNaN(startDateObj)) {
        return "";
      } else {
        return startDateObj.toLocaleString();
      }
    }
  },
  {
    label: 'End Date',
    body: ({endDate}) => {
      const endDateObj = new Date(endDate);
      if (isNaN(endDateObj)) {
        return "";
      } else {
        return endDateObj.toLocaleString();
      }
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
    const persons = {};
    // get all persons data
    await getInstancesInClass('cids:Person').then((res) => {
      Object.keys(res).forEach((key) => {
        const personId = key.split('#')[1];
        persons[personId] = res[key];
      });
    });
    const data = [];
    for (const outcomeOccurrence of outcomeOccurrences) {
      const outcomeOccurrenceData = {_id: outcomeOccurrence._id};
      if (outcomeOccurrence.characteristicOccurrences)
        for (const occ of outcomeOccurrence.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Start Date') {
            outcomeOccurrenceData.startDate = occ.dataDateValue;
          } else if (occ.occurrenceOf?.name === 'End Date') {
            outcomeOccurrenceData.endDate = occ.dataDateValue;
          } else if (occ.occurrenceOf?.name === 'Person') {
            outcomeOccurrenceData.person = occ.objectValue;
          }
        }
      if (outcomeOccurrenceData.person){
        // get corresponding person data
        outcomeOccurrenceData.person = persons[outcomeOccurrence.person.slice(1)]
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
