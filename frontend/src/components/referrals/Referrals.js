import React from 'react';
import {Link} from "../shared"
import {GenericPage} from "../shared";
import {deleteSingleGeneric, fetchMultipleGeneric} from "../../api/genericDataApi";
import {formatName} from "../../helpers/formatters";

const TYPE = 'referrals';

const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      return <Link color to={`/${TYPE}/${_id}`}>{_id}</Link>;
    },
    sortBy: ({_id}) => Number(_id),
  },
  {
    label: 'Type',
    body: ({referralType}) => {
      return referralType
      // return <Link color to={`/providers/${serviceProvider.split('_')[1]}`}>
      //   {serviceProvider}
      // </Link>;
    }
  },
  {
    label: 'Status',
    body: ({referralStatus}) => {
      return referralStatus
      // return <Link color to={`/providers/${serviceProvider.split('_')[1]}`}>
      //   {serviceProvider}
      // </Link>;
    }
  },
  {
    label: 'Client',
    body: ({ client }) => {
      return <Link color to={`/clients/${client.id}`}>{client.name}</Link>;
    },
    sortBy: ({ client }) => client.name,
  }
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
    const referrals = (await fetchMultipleGeneric('referral')).data;
    const data = [];
    for (const referral of referrals) {
      data.push({
        _id: referral._id,
        referralStatus: referral.referralStatus,
        referralType: referral.referralType,
        client: {
          name: formatName(referral.client.firstName, referral.client.lastName),
          id: referral.client._id
        }
      });

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
