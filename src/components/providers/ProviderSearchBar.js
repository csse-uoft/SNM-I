import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';
import { Link } from 'react-router-dom';
import { searchProviders, fetchProviders, createProvider, updateProvider, deleteProvider } from '../../store/actions/providerActions.js'
import { connect } from 'react-redux';


class ProviderSearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleInput=this.handleInput.bind(this);
    this.handleTypeChange=this.handleTypeChange.bind(this);
    this.state = {
      searchText: '',
      searchType: 'name'
    }
  }
  
  handleInput(event) {
    const value = event.target.value;
    this.setState({ searchText: value});
    this.props.dispatch(searchProviders(value, this.state.searchType));
  }

  handleTypeChange(event) {
    const value = event.target.value;
    console.log(value);
    this.setState({searchType: value});
    this.props.dispatch(searchProviders(this.state.searchText, value));
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.state.value}
          onChange={this.handleInput}
        />

        <FormControl componentClass="select" placeholder="select" onChange={this.handleTypeChange}>
          <option value="name"> Name </option>
          <option value="email"> Email </option>
        </FormControl>
      </form>
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