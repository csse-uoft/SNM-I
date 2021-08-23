import React from 'react';
import _ from 'lodash';

import TR from '../../shared/TR';

import { formatLocation } from '../../../helpers/location_helpers';
import { formatPhoneNumber } from '../../../helpers/phone_number_helpers';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useProfileTableStyles from '../../../stylesheets/profile-table'

export default function ClientInfoTable({ step, client, infoFields, clientFields }) {

  let rowTitle, rowValue;
  const infoRows = _.map(infoFields, infoField => {


    rowTitle = clientFields[infoField].label;
    // console.log("%%%%%%%%% clientFields[infoField].label", clientFields[infoField].label);

    switch(infoField) {
        case 'first_name':
        if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client.profile[infoField];
        // console.log("$$$$$$ infoField, rowValue, client.profile  $$ ",infoField, rowValue,  client.profile);
        }
        break;
      case 'middle_name':
        if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        // console.log("$$$$$$ infoField, client.profile  $$  ", infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'last_name':
      if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        // console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'preferred_name':
      if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        // console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'gender':
      if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        // console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'birth_date':
        if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        // console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'email':
        if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        // console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'primary_phone_number':
        if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client.profile[infoField];
        // console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        }
        break;
      case 'alt_phone_number':
        if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client.profile[infoField] ? formatPhoneNumber(client.profile[infoField]) : 'None provided';
        }
        break;
      case "address":
      if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client[infoField] ? formatLocation(client[infoField]) : "None provided";
        }
        break;

      case "has_children":
        if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client[infoField] ? 'Yes' : 'No';
        }
        break;
      case "other_languages":
      if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        // console.log("$$$$$$ infoField, client.profile",infoField,  client.profile);
        }
        rowValue = client.profile[infoField];
        break;
      case "eligibilities":
      if (client.profile === undefined){
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = (client[infoField] || []).join(', ')
        }
        break;
      default:
        rowValue = client[infoField];
    }
    return (
      <TR
        key={infoField}
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
