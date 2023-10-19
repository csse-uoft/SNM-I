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

  const nameFormatter = needOccurrence => needOccurrence._id;

  const linkFormatter = needOccurrence => `/${TYPE}/${needOccurrence.id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const needOccurrences = (await fetchMultipleGeneric('needOccurrence')).data;
    const data = [];
    for (const needOccurrence of needOccurrences) {
      const needOccurrenceData = {
              _id: needOccurrence._id,
              startDate: needOccurrence.startDate,
              endDate: needOccurrence.endDate
      };
      if (needOccurrence.occurrenceOf){
        // get corresponding need data
        needOccurrenceData.need = {
          name: needOccurrence.occurrenceOf.description,
          _id: needOccurrence.occurrenceOf._id,
        }
      }
      if (needOccurrence.characteristicOccurrences)
        for (const occ of needOccurrence.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Address') {
            const obj = (await fetchSingleGeneric("needOccurrence", needOccurrence._id)).data; // TODO: inefficient!
            needOccurrenceData.address = obj['characteristic_' + addressCharacteristicId];
          }
        }
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
