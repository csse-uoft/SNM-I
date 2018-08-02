import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class EligibilitiesIndex extends Component {
  render() {
    return(
      <Table
        className="dashboard-table"
        striped
        bordered
        condensed
        hover
      >
        <thead>
          <tr>
            <th>Title</th>
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
