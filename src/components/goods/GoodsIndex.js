import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class GoodsIndex extends Component {
  render() {
    return(
      <Table striped condensed hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Condition</th>
            <th>Contact Info</th>
            <th>Image Link</th>
          </tr>
        </thead>
        <tbody>
          { this.props.children }
        </tbody>
      </Table>
    )
  }
}