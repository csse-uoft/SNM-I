import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class UsersIndex extends Component {
  render() {
    return(
      <Table
        className="dashboard-table"
        striped
        bordered
        condensed
        hover
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
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
