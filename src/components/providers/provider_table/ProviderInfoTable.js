import React from 'react';
import _ from 'lodash';

import TR from '../../shared/TR';
import { defaultContactFields } from '../../../constants/default_fields.js'
import { formatLocation } from '../../../helpers/location_helpers';
import { formatPhoneNumber } from '../../../helpers/phone_number_helpers';
import { operationHourListToObject, OperationHourTable }
  from '../../../helpers/operation_hour_helpers';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useProfileTableStyles from '../../../stylesheets/profile-table'

export default function ProviderInfoTable({ step, provider, infoFields, providerFields }) {
  let rowTitle, rowValue;
  const infoRows = _.map(infoFields, (data, fieldId) => {
    if (data.type === 'field') {
      rowTitle = providerFields[fieldId].label;
      switch(fieldId) {
        case 'first_name':
        case 'middle_name':
        case 'last_name':
        case 'preferred_name':
        case 'gender':
        case 'birth_date':
        case 'email':
          if (provider.type === 'Individual') {
            rowValue = provider.profile[fieldId];
          } else {
            rowValue = provider[fieldId];
          }
          break;
        case 'primary_phone_number':
        case 'alt_phone_number':
          if (provider.type === 'Individual') {
            rowValue = provider.profile[fieldId] ? formatPhoneNumber(provider.profile[fieldId]) : 'None provided';
          } else {
            rowValue = provider[fieldId] ? formatPhoneNumber(provider[fieldId]) : 'None provided';
          }
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
          const operation_hours = operationHourListToObject(provider.operation_hours)
          rowValue = <OperationHourTable operationHourObj={operation_hours} />
          break;
        case 'primary_contact':
        case 'secondary_contact':
          if (provider[fieldId]) {
            rowValue = _.map(_.keys(defaultContactFields), contactField => {
              if (provider[fieldId]['profile'][contactField]) {
                return (
                  <li key={contactField}>
                    {`${providerFields[contactField]['label']}: ${provider[fieldId]['profile'][contactField]}`}
                  </li>
                )
              }
            })
          }
          else {
            rowValue = null;
          }
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
      <TR
        key={fieldId}
        title={rowTitle}
        value={rowValue}
      />
    );
  })

  const classes = useProfileTableStyles()
  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table aria-label="Profile table">
        <TableHead>
          <TableRow >
            <TableCell className={classes.title}>{step}</TableCell>
            <TableCell className={classes.title2}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {infoRows}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
