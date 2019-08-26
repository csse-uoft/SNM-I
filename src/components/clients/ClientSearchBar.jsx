import _ from 'lodash';
import React, { Component } from 'react';

import { Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import { searchClients } from '../../store/actions/clientActions.js'
import { connect } from 'react-redux';


class ClientSearchBar  extends Component {
  constructor(props) {
    super(props);
    this.handleInput=this.handleInput.bind(this);
    this.handleSearchChange=this.handleSearchChange.bind(this);
    this.handleSortChange=this.handleSortChange.bind(this);

    this.state = {
      searchType: 'last_name',
      searchText: '',
      sortType: 'name'
    }
  }

  handleInput(event) {
    const value = event.target.value;
    this.setState({ searchText: value});
    this.props.dispatch(searchClients(value, this.state.searchType, this.state.sortType));
  }

  handleSearchChange(event) {
    const value = event.target.value;
    console.log(value);
    this.setState({searchType: value});
    this.props.dispatch(searchClients(this.state.searchText, value, this.state.sortType));
  }

  handleSortChange(event) {
    const value = event.target.value;
    console.log(value);
    this.setState({sortType: value});
    this.props.dispatch(searchClients(this.state.searchText, this.state.searchType, value));
  }

  render() {
    return (
      <Form inline>
        <FormGroup controlId="searchBar">
        {/* <FormGroup controlId="value"> */}
          <FormControl
            type="text"
            placeholder="Search..."
            value={this.state.value}
            onChange={this.handleInput}
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

        <FormGroup controlId="numberPerPage">
          <ControlLabel> Number per page: </ControlLabel>{' '}
          <FormControl componentClass="select" placeholder="select" onChange={this.props.changeNumberPerPage}>
            <option value="10"> 10 </option>
            <option value="20"> 20 </option>
            <option value="all"> All </option>
          </FormControl>
        </FormGroup>{' '}
      </Form>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    clients: state.clients.index, //array of json
    clientsLoaded: state.clients.clientsLoaded
  }
}

export default connect(
  mapStateToProps
)(ClientSearchBar);
