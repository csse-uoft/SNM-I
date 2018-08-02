import _ from 'lodash';
import React, { Component } from 'react';

import { Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';


class ClientSearchBar  extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'last_name',
      value: ''
    }

    this.handleFormValChange = this.handleFormValChange.bind(this);
  }

  handleFormValChange(e) {
    this.setState(
      { [e.target.id] : e.target.value },
      () => this.props.handleSearchBarChange(this.state.type, this.state.value)
    );
  }

  render() {
    return (
      <Form inline>
        <FormGroup controlId="value">
          <FormControl
            type="text"
            placeholder="Search..."
            value={this.state.value}
            onChange={this.handleFormValChange}
          />
        </FormGroup>{' '}
        <FormGroup controlId="type">
          <ControlLabel>Search by:</ControlLabel>{' '}
          <FormControl
            componentClass="select"
            placeholder="select"
            value={this.state.type}
            onChange={this.handleFormValChange}
          >
            <option value="last_name">Last name</option>
            <option value="address">Address</option>
          </FormControl>
        </FormGroup>{' '}
        <FormGroup controlId="sort_by">
          <ControlLabel>Sort by:</ControlLabel>{' '}
          <FormControl
            componentClass="select"
            placeholder="select"
            value={this.props.orderBy}
            onChange={this.props.handleSortByChange}
          >
            <option value="-updated_at">Last Updated</option>
            <option value="first_name">First Name (A-Z)</option>
            <option value="-first_name">First Name (Z-A)</option>
            <option value="last_name">Last Name (A-Z)</option>
            <option value="-last_name">Last Name (Z-A)</option>
          </FormControl>
        </FormGroup>
      </Form>
    );
  }
};

export default ClientSearchBar;
