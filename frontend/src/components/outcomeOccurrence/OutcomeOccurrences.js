import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../../api/genericDataApi";
import { getInstancesInClass } from "../../api/dynamicFormApi";

const TYPE = 'outcomeOccurrences';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    },
    sortBy: ({_id}) => Number(_id),
  },
  {
    label: 'Outcome',
    body: ({outcome}) => {
      if (outcome) {
        return <Link color to={`/outcome/${outcome._id}/edit`}>{outcome.name}</Link>;
      } else {
        return "";
      }
    },
    sortBy: ({outcome}) => Number(outcome.name),
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
    },
    sortBy: ({startDate}) => Number(new Date(startDate)),
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
    },
    sortBy: ({endDate}) => Number(new Date(endDate)),
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

  const nameFormatter = outcomeOccurrence => 'Outcome Occurrence ' + outcomeOccurrence._id;

  const linkFormatter = outcomeOccurrence => `/${TYPE}/${outcomeOccurrence._id}`;

  const fetchData = async () => {
    const outcomeOccurrences = (await fetchMultipleGeneric('outcomeOccurrence')).data;
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
          name: outcomeOccurrence.occurrenceOf.description,
          _id: outcomeOccurrence.occurrenceOf._id,
        }
      }
      if (outcomeOccurrence.address) {
        outcomeOccurrenceData.address = outcomeOccurrence.address;
      }
      data.push(outcomeOccurrenceData);
    }
    return data;
  }

  const deleteOutcomeOccurrence = (id) => deleteSingleGeneric('outcomeOccurrence', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Outcome Occurrences"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteOutcomeOccurrence}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
