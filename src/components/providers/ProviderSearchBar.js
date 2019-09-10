import React, { Component } from 'react';
import _ from 'lodash';

import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';

import { connect } from 'react-redux';
import { searchProviders } from '../../store/actions/providerActions.js';


class ProviderSearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleInput=this.handleInput.bind(this);
    this.handleSearchChange=this.handleSearchChange.bind(this);
    this.handleSortChange=this.handleSortChange.bind(this);
    this.handleDisplayChange=this.handleDisplayChange.bind(this);
    this.props.dispatch(fetchOntologyCategories('services'));

    this.state = {
      searchType: 'name',
      searchText: '',
      sortType: 'name',
      displayType: 'all'
    }
  }

  handleDisplayChange(event){
    const value = event.target.value;
    this.setState({ displayType: value});
    this.props.dispatch(searchProviders(this.state.searchText, this.state.searchType, value, this.state.sortType));
  }

  handleInput(event) {
    console.log("provider search bar ---------> event.target.value: ", event.target.value);
    const value = event.target.value.toLowerCase();
    this.setState({ searchText: value});
    this.props.dispatch(searchProviders(value, this.state.searchType, this.state.displayType, this.state.sortType));
  }

  handleSearchChange(event) {
    const value = event.target.value;
    console.log(value);
    this.setState({searchType: value});
    this.props.dispatch(searchProviders(this.state.searchText, value, this.state.displayType, this.state.sortType));
  }

  handleSortChange(event) {
    const value = event.target.value;
    console.log(value);
    this.setState({sortType: value});
    this.props.dispatch(searchProviders(this.state.searchText, this.state.searchType, this.state.displayType, value));
  }
  // componenetDidMount() {
  //   this.props.dispatch(fetchOntologyCategories('services'));
  // }

  render() {
    return (
      <Form inline>
        <FormGroup controlId="searchBar">
          <FormControl
            type="text"
            placeholder="Search..."
            value={this.state.value}
            onChange={this.handleInput}
          />
        </FormGroup>{' '}
        <FormGroup controlId="searchBy">
          <ControlLabel> Search by: </ControlLabel>{' '}
          <FormControl 
            componentClass="select" 
            placeholder="select" 
            onChange={this.props.handleTypeChange}
          >
            <option value="name"> Name </option>
            <option value="email"> Email </option>
            <option value="phone"> Phone </option>
          </FormControl>
        </FormGroup>{' '}

        <FormGroup controlId="showOnly">
          <ControlLabel> Show: </ControlLabel>{' '}
          <FormControl 
            componentClass="select" 
            placeholder="select" 
            onChange={this.props.handleProviderTypeChange}
          >
            <option value="all"> All </option>
            <option value="Individual"> Individual </option>
            <option value="Organization"> Organization </option>
          </FormControl>
        </FormGroup>{' '}

        <FormGroup controlId="sortBy">
          <ControlLabel> Sort by: </ControlLabel>{' '}
          <FormControl 
            componentClass="select" 
            placeholder="select" 
            onChange={this.handleSortChange}
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
          </FormControl>
        </FormGroup>{' '}

        <FormGroup controlId="numberPerPage">
          <ControlLabel> Number per page: </ControlLabel>{' '}
          <FormControl 
            componentClass="select" 
            placeholder="select" 
            onChange={this.props.changeNumberPerPage}
          >
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
    providers: state.providers.index, //array of json
    providersLoaded: state.providers.loaded,
  }
}

export default connect(
  mapStateToProps
)(ProviderSearchBar);
