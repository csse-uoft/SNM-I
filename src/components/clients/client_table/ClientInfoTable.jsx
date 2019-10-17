import React from 'react';
import _ from 'lodash';

import TableRow from '../../shared/TableRow';

import { formatLocation } from '../../../helpers/location_helpers';
import { formatPhoneNumber } from '../../../helpers/phone_number_helpers';

import { Table } from 'react-bootstrap';

export default function ClientInfoTable({ step, client, infoFields, clientFields }) {
  
  console.log("ClientInfoTable(): step", step);
  console.log("ClientInfoTable(): client ", client);
  console.log("ClientInfoTable(): infoFields ", infoFields);
  console.log("ClientInfoTable(): clientFields", clientFields);
  
  let rowTitle, rowValue;
  const infoRows = _.map(infoFields, infoField => {
  
    
    rowTitle = clientFields[infoField].label;
    console.log("%%%%%%%%% clientFields[infoField].label", clientFields[infoField].label);
    
    switch(infoField) {
        case 'first_name':   
        if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client.profile[infoField];
        console.log("$$$$$$ infoField, rowValue, client.profile  $$ ",infoField, rowValue,  client.profile);
        }
        break;
      case 'middle_name':
        if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        console.log("$$$$$$ infoField, client.profile  $$  ", infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'last_name':
      if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'preferred_name':
      if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'gender':
      if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'birth_date':
        if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField]; 
        }
        break;
      case 'email':
        if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        rowValue = client.profile[infoField];
        }
        break;
      case 'primary_phone_number':
        if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client.profile[infoField];
        console.log("$$$$$$ infoField, client.profile   $$  ",infoField,  client.profile);
        }
        break;
      case 'alt_phone_number':
        if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client.profile[infoField] ? formatPhoneNumber(client.profile[infoField]) : 'None provided';
        }
        break;
      case "address":
      if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client[infoField] ? formatLocation(client[infoField]) : "None provided";
        }
        break;
        
      case "has_children":
        if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = client[infoField] ? 'Yes' : 'No';
        }
        break;
      case "other_languages":
      if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        console.log("$$$$$$ infoField, client.profile",infoField,  client.profile);
        }
        rowValue = client.profile[infoField];
      case "eligibilities":
      if (client.profile === undefined){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        else{
        rowValue = (client[infoField] || []).join(', ')
        }
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
