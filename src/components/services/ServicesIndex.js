import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import ServiceSearchBar from './ServiceSearchBar.js';
import './../../stylesheets/Common.css'

export default class ServicesIndex extends Component {
  render() {
    return(
      <div>
      <ServiceSearchBar> 
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