import React, { Component } from 'react';
import NeedRow from './NeedRow.js'
import { Table } from 'react-bootstrap';

export default class NeedGroup extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const p = this.props;
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Description</th>
            <th>Status</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          { p.needs &&
            p.needs.map((need) => {
              return <NeedRow key={ need.id } need={ need } />
            })
          }
        </tbody>
      </Table>
    )
  }
}
