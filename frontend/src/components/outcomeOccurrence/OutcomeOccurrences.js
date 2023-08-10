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
    label: 'Outcome',
    body: ({outcome}) => {
      if (outcome) {
        return <Link color to={`/outcome/${outcome._id}/edit`}>{outcome.name}</Link>;
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
    const outcomes = {};
    // get all outcomes data
    await getInstancesInClass(':Outcome').then((res) => {
      Object.keys(res).forEach((key) => {
        const outcomeId = key.split('#')[1];
        outcomes[outcomeId] = res[key];
      });
    });
    const data = [];
    for (const outcomeOccurrence of outcomeOccurrences) {
      const outcomeOccurrenceData = {
              _id: outcomeOccurrence._id,
              startDate: outcomeOccurrence.startDate,
              endDate: outcomeOccurrence.endDate
      };
      if (outcomeOccurrence.occurrenceOf){
        // get corresponding outcome data
        outcomeOccurrenceData.outcome = {
          name: outcomes[outcomeOccurrence.occurrenceOf.slice(1)],
          _id: outcomeOccurrence.occurrenceOf.split('_')[1],
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
