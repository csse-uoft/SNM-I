import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import GoodSearchBar from './GoodSearchBar.js';
import './../../stylesheets/Common.css'

export default class GoodsIndex extends Component {
  render() {
    return(
      <div>
      <GoodSearchBar> 
      </GoodSearchBar>
      <hr />
      <Table className="dashboard-table"  striped bordered condensed hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Description</th>
            <th>Category</th>
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