import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class ResourcesIndex extends Component {
  render() {
    return(
      <Table striped condensed hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Details</th>
            <th>Provider</th>
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