import React from 'react';
import _ from 'lodash';

import TableRow from '../../shared/TableRow';

import { formatLocation } from '../../../helpers/location_helpers';
import { formatPhoneNumber } from '../../../helpers/phone_number_helpers';
import { formatOperationHour } from '../../../helpers/operation_hour_helpers';

import { Table } from 'react-bootstrap';

export default function ProviderInfoTable({ step, provider, infoFields, providerFields }) {
  let rowTitle, rowValue;
  const infoRows = _.map(infoFields, (data, fieldId) => {
    if (data.type === 'field') {
      rowTitle = providerFields[fieldId].label;
      switch(fieldId) {
        case 'primary_phone_number':
        case 'alt_phone_number':
          rowValue = provider[fieldId] ? formatPhoneNumber(provider[fieldId]) : 'None provided';
          break;
        case "main_address":
          rowValue = provider[fieldId] ? formatLocation(provider[fieldId]) : "None provided";
          break;
        case "other_addresses":
          if (provider[fieldId]) {
            rowValue = _.map(provider[fieldId], (address, index) =>
              <p key={index}>{formatLocation(address)}</p>)
          }
          else {
            rowValue = null;
          }
          break;
        case "languages":
          rowValue = (provider[fieldId] || []).join(', ')
          break;
        case "availability":
          rowValue = _.map(provider.operation_hours, day =>
            <p key={day.week_day}>{formatOperationHour(day)}</p>)
          break;
        default:
          rowValue = provider[fieldId];
      }
    }
    else if (data.type === 'question') {
      rowTitle = fieldId;
      const response = _.find(provider.responses, response => {
        return response.question_id === data.id.toString()
      })
      if (response) {
        rowValue = response.text
      }
      else {
        rowValue = null;
      }
    }
    return (
      <TableRow
        key={fieldId}
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
