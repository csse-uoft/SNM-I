import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class ClientsIndex extends Component {
  render() {
    return(
      <Table
        className="clients-table"
        striped
        bordered
        condensed
        hover
      >
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
            <th>Email</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.props.children }
        </tbody>
      </Table>
    )
  }
}
