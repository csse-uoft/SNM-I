import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import ProviderSearchBar from './ProviderSearchBar';

export default class ProvidersIndex extends Component {
  render() {
    console.log('procider index here ------------>');
    return(
      <div> 
      <ProviderSearchBar changeNumberPerPage={this.props.changeNumberPerPage}>
      </ProviderSearchBar>
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