import React from 'react';
import {Link} from "../shared"
import { GenericPage } from "../shared";
import { deleteSingleGeneric, fetchMultipleGeneric } from "../../api/genericDataApi";

const TYPE = 'referrals';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>;
    }
  },
  {
    label: 'Type',
    body: ({referralType}) =>{
      return referralType
      // return <Link color to={`/providers/${serviceProvider.split('_')[1]}`}>
      //   {serviceProvider}
      // </Link>;
    }
  },
  {
    label: 'Status',
    body: ({referralStatus}) =>{
      return referralStatus
      // return <Link color to={`/providers/${serviceProvider.split('_')[1]}`}>
      //   {serviceProvider}
      // </Link>;
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

export default function Referrals() {

  const nameFormatter = service => service.name;

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
    const services = (await fetchMultipleGeneric('referral')).data;
    const data = [];
    for (const service of services) {
      const serviceData = {_id: service._id};
      if (service.characteristicOccurrences)
        for (const occ of service.characteristicOccurrences) {
          if (occ.occurrenceOf?.name === 'Referral Type') {
            serviceData.referralType = occ.dataStringValue;
          } else if (occ.occurrenceOf?.name === 'Referral Status') {
            serviceData.referralStatus = occ.objectValue;
          }
        }
      data.push(serviceData);
    }
    return data;
  };

  const deleteReferral = (id) => deleteSingleGeneric('referral', id);

  return (
    <GenericPage
      type={TYPE}
      columnsWithoutOptions={columnsWithoutOptions}
      fetchData={fetchData}
      deleteItem={deleteReferral}
      generateMarkers={generateMarkers}
      nameFormatter={nameFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
