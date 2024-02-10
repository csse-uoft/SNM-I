import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric } from "../../api/genericDataApi";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";

const TYPE = 'needOccurrences';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    }
  },
  {
    label: 'Need',
    body: ({need}) => {
      if (need) {
        return <Link color to={`/need/${need._id}/edit`}>{need.name}</Link>;
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
  {
    label: 'Client Name/ID',
    body: ({client}) => {
      if (client == null || client == undefined){
        return 'None';
      }
      return client;
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

export default function NeedOccurrences() {

  const nameFormatter = needOccurrence => 'Need Occurrence ' + needOccurrence._id;

  const linkFormatter = needOccurrence => `/${TYPE}/${needOccurrence._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const needOccurrences = (await fetchMultipleGeneric('needOccurrence')).data;
    const data = [];
    for (const needOccurrence of needOccurrences) {
      const needOccurrenceData = {
              _id: needOccurrence._id,
              startDate: needOccurrence.startDate,
              endDate: needOccurrence.endDate,
              client: needOccurrence.client
      };
      if (needOccurrence.occurrenceOf){
        // get corresponding need data
        needOccurrenceData.need = {
          name: needOccurrence.occurrenceOf.description,
          _id: needOccurrence.occurrenceOf._id,
          client: needOccurrence.occurrenceOf.client
        }
      }
      if (needOccurrence.address)
        needOccurrenceData.address = needOccurrence.address;
      data.push(needOccurrenceData);
      console.log(data)
    }
    return data;
  }

  const deleteNeedOccurrence = (id) => deleteSingleGeneric('needOccurrence', id);

  return (
    <GenericPage
      type={TYPE}
      title={"Need Occurrences"}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteNeedOccurrence}
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
