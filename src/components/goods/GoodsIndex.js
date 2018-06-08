import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import GoodSearchBar from './GoodSearchBar.js';

export default class GoodsIndex extends Component {
  render() {
    return(
      <div>
      <GoodSearchBar> 
      </GoodSearchBar>
      <hr />
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Provider</th>
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