import React from 'react'
import { Link } from '../shared';
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../../api/genericDataApi";
import { getInstancesInClass } from "../../api/dynamicFormApi";

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
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  )
}
