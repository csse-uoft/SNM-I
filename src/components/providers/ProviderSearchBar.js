import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';
import { Link } from 'react-router-dom';
import { searchProviders, fetchProviders, createProvider, updateProvider, deleteProvider } from '../../store/actions/providerActions.js'
import { connect } from 'react-redux';


class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleInput=this.handleInput.bind(this);
    this.state = {
      searchText: '',
    }
  }
  
  handleInput(event) {
    const value = event.target.value;
    this.setState({ searchText: value});
    this.props.dispatch(searchProviders(value))
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
)(SearchBar);