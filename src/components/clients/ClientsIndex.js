import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import './../../stylesheets/Common.scss'
import ClientSearchBar from './ClientSearchBar';

export default class ClientsIndex extends Component {
  render() {
    return(
      <div>
      <ClientSearchBar changeNumberPerPage={this.props.changeNumberPerPage}>
      </ClientSearchBar>
        <hr />
      <Table
        className="dashboard-table"
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
      </div>
    )
  }
}
