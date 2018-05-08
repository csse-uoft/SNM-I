import React, { Component } from 'react';
import NeedRow from './NeedRow.js'
import { Table } from 'react-bootstrap';

export default class NeedGroup extends Component {
  render() {
    const p = this.props;
    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Requirements</th>
            <th>Created At</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            p.needs.map((need) => {
              return <NeedRow key={ need.id } need={ need } showSearchModal={p.showSearchModal}
                        delete={p.delete} />
            })
          }
        </tbody>
      </Table>
    )
  }
}