import React, { Component } from 'react';
import { TableCell, TableRow } from "@mui/material";


export default class AppointmentRow extends Component {
  render() {
    const appointment = this.props.appointment;

    return (
      <TableRow>
        {/*<td>*/}
        {/*  <Label>{appointment.type}</Label>{' '}*/}
        {/*  {appointment.category}*/}
        {/*</td>*/}
        <TableCell component="th" scope="row">
          {appointment.category}
        </TableCell>
        <TableCell align="left">{appointment.date}</TableCell>
        <TableCell align="left">{`${appointment.start_time} - ${appointment.end_time}`}</TableCell>
        <TableCell align="left">{appointment.description}</TableCell>
      </TableRow>
    )
  }
}
