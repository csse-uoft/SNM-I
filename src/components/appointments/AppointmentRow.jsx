import React, { Component } from 'react';
import { Label } from 'react-bootstrap';


export default class AppointmentRow extends Component {
  render() {
    const appointment = this.props.appointment;

    return(
      <tr>
        <td>
          <Label>{appointment.type}</Label>{' '}
          {appointment.category}
        </td>
        <td>
          {appointment.date}
        </td>
        <td>
          {`${appointment.start_time} - ${appointment.end_time}`}
        </td>
        <td>
          {appointment.description}
        </td>
      </tr>
    )
  }
}
