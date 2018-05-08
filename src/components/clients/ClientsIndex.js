import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class ClientsIndex extends Component {
  render() {
    return(
      <Table striped condensed hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
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