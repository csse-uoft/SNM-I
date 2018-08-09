import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class ProvidersIndex extends Component {
  render() {
    return(
      <div> 
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
              <th>Type</th>
              <th>Email</th>
              <th>Phone</th>
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