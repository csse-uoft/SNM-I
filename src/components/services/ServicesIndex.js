import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import ServiceSearchBar from './ServiceSearchBar.js';

export default class ServicesIndex extends Component {
  render() {
    return(
      <div>
      <ServiceSearchBar> 
      </ServiceSearchBar>
      <hr />
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th></th>
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