import React from 'react';
import {Link} from "../shared"
import {GenericPage} from "../shared";
import {deleteSingleGeneric, fetchMultipleGeneric, fetchSingleGeneric} from "../../api/genericDataApi";
import {formatName} from "../../helpers/formatters";
import {getAddressCharacteristicId} from "../shared/CharacteristicIds";

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

  const nameFormatter = referral => 'Referral ' + referral._id;

  const linkFormatter = referral => `/${TYPE}/${referral._id}`;

  const fetchData = async () => {
    const addressCharacteristicId = await getAddressCharacteristicId();
    const referrals = (await fetchMultipleGeneric('referral')).data;
    const data = [];
    for (const referral of referrals) {
      const referralData = {
        _id: referral._id,
        referralStatus: referral.referralStatus,
        referralType: referral.referralType,
        client: {
          name: formatName(referral.client.firstName, referral.client.lastName, 'client',  referral.client._id),
          id: referral.client._id
        }
      };
      if (referral.address) {
        referralData.address = referral.address;
      }
      data.push(referralData);

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
      nameFormatter={nameFormatter}
      linkFormatter={linkFormatter}
      tableOptions={{
        idField: '_id'
      }}
    />
  );
}
