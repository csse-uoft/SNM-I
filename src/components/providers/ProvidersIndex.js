import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import SearchBar from './ProviderSearchBar.js';

export default class ProvidersIndex extends Component {
  render() {
    return(
      <div> 
        <SearchBar> 
        </SearchBar>
        <Table striped condensed hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Email</th>
              <th>Phone</th>
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