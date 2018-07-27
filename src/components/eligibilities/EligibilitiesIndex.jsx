import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class EligibilitiesIndex extends Component {
  render() {
    return(
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th></th>
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
