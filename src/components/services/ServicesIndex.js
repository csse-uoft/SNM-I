import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import ServiceSearchBar from './ServiceSearchBar.js';

export default class ServicesIndex extends Component {
  render() {
    console.log("------------->service index this: ", this);
    return(
      <div>
      <ServiceSearchBar changeNumberPerPage={this.props.changeNumberPerPage}>
      </ServiceSearchBar>
      <hr />
      <Table className="dashboard-table" striped bordered condensed hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Description</th>
            <th>Category</th>
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