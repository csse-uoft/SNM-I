import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { searchProviders } from '../../store/actions/providerActions.js'
import { connect } from 'react-redux';


class ProviderSearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleInput=this.handleInput.bind(this);
    this.handleTypeChange=this.handleTypeChange.bind(this);
    this.handleProviderTypeChange=this.handleProviderTypeChange.bind(this);
    this.state = {
      searchText: '',
      searchType: 'name',
      searchProviderType: 'both'
    }
  }
  
  handleInput(event) {
    const value = event.target.value;
    this.setState({ searchText: value});
    this.props.dispatch(searchProviders(value, this.state.searchType, this.state.searchProviderType));
  }

  handleTypeChange(event) {
    const value = event.target.value;
    console.log(value);
    this.setState({searchType: value});
    this.props.dispatch(searchProviders(this.state.searchText, value, this.state.searchProviderType));
  }

  handleProviderTypeChange(event) {
    const value = event.target.value;
    this.setState({searchProviderType: value});
    this.props.dispatch(searchProviders(this.state.searchText, this.state.value, value));
  }

  render() {
    return (
      <Form inline>
        <FormGroup controlId="searchBar">
          <FormControl 
            type='text' 
            placeholder="Search..." 
            value={this.state.value}
            onChange={this.handleInput}
          />
        </FormGroup> {' '}
        <FormGroup controlId="searchBy">
          <ControlLabel> Search by: </ControlLabel>{' '}
          <FormControl componentClass="select" placeholder="select" onChange={this.handleTypeChange}>
            <option value="name"> Name </option>
            <option value="email"> Email </option>
            <option value="phone"> Phone </option>
          </FormControl>
        </FormGroup>{' '}

        <FormGroup controlId="showOnly">
          <ControlLabel> Show: </ControlLabel>{' '}
          <FormControl componentClass="select" placeholder="select" onChange={this.handleProviderTypeChange}>
            <option value="all"> All </option>
            <option value="Individual"> Individual </option>
            <option value="Organization"> Organization </option>
          </FormControl>
        </FormGroup>{' '}

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
    providers: state.providers.index, //array of json 
    providersLoaded: state.providers.loaded
  }
}

export default connect(
  mapStateToProps
)(ProviderSearchBar);