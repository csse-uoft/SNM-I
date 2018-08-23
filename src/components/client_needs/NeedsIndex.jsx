import React, { Component } from 'react';
import _ from 'lodash';

import NeedRow from './NeedRow.js'
import { Table } from 'react-bootstrap';

export default class NeedGroup extends Component {
  render() {
    const p = this.props;
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Type</th>
            <th>Description</th>
            <th />
          </tr>
        </thead>
        <tbody>
          { p.needs &&
            _.map(p.needsOrder, (needId) => {
              const need = p.needs[needId]
              return (
                <NeedRow
                  key={need.id}
                  clientId={p.clientId}
                  need={need}
                  handleShow={p.handleShow}
                />
              )
            })
          }
        </tbody>
      </Table>
    )
  }
}
