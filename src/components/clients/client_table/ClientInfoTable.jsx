import React from 'react';
import _ from 'lodash';

import TableRow from '../../shared/TableRow';

import { formatLocation } from '../../../helpers/location_helpers';
import { formatPhoneNumber } from '../../../helpers/phone_number_helpers';

import { Table } from 'react-bootstrap';

export default function ClientInfoTable({ step, client, infoFields, clientFields }) {
  let rowTitle, rowValue;
  const infoRows = _.map(infoFields, infoField => {
    rowTitle = clientFields[infoField].label;
    switch(infoField) {
      case 'first_name':
      case 'middle_name':
      case 'last_name':
      case 'preferred_name':
      case 'gender':
      case 'birth_date':
      case 'email':
        rowValue = client.profile[infoField];
        break;
      case 'primary_phone_number':
      case 'alt_phone_number':
        rowValue = client.profile[infoField] ? formatPhoneNumber(client.profile[infoField]) : 'None provided';
        break;
      case "address":
        rowValue = client[infoField] ? formatLocation(client[infoField]) : "None provided";
        break;
      case "has_children":
        rowValue = client[infoField] ? 'Yes' : 'No';
        break;
      case "other_languages":
      case "eligibilities":
        rowValue = (client[infoField] || []).join(', ')
        break;
      default:
        rowValue = client[infoField];
    }
    return (
      <TableRow
        key={infoField}
        title={rowTitle}
        value={rowValue}
      />
    );
  })

  return (
    <Table bordered condensed className="profile-table">
      <tbody>
        <tr>
          <td colSpan="2"><b>{step}</b></td>
        </tr>
        {infoRows}
      </tbody>
    </Table>
  )
}
