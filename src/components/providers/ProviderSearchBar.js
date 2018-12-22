import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';

import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';

import { connect } from 'react-redux';


class ProviderSearchBar extends Component {
  componenetWillMount() {
    this.props.dispatch(fetchOntologyCategories('services'));
  }

  render() {
    const categories = this.props.servicesCategories.map(category => {
      return {value: category, label: category};
      }
    );
    return (
      <div>
      <Form inline>
        <FormGroup controlId="searchBar">
          <FormControl 
            type='text' 
            placeholder="Search..." 
            value={this.props.searchValue}
            onChange={this.props.handleInput}
          />
        </FormGroup> {' '}
        <FormGroup controlId="searchBy">
          <ControlLabel> Search by: </ControlLabel>{' '}
          <FormControl componentClass="select" placeholder="select" onChange={this.props.handleTypeChange}>
            <option value="name"> Name </option>
            <option value="email"> Email </option>
            <option value="phone"> Phone </option>
          </FormControl>
        </FormGroup>{' '}

        <FormGroup controlId="showOnly">
          <ControlLabel> Show: </ControlLabel>{' '}
          <FormControl componentClass="select" placeholder="select" onChange={this.props.handleProviderTypeChange}>
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

      <Select
        value={this.props.selectedCategories}
        isMulti={true}
        closeMenuOnSelect={false}
        name="categories"
        className="basic-multi-select"
        classNamePrefix="select"
        options={categories}
        onChange={(category) => this.props.handleCategorySelection(category)}
      />
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    providers: state.providers.index, //array of json
    providersById: state.providers.byId,
    providersLoaded: state.providers.loaded,
    servicesCategories: state.ontology.services.categories
  }
}

export default connect(
  mapStateToProps
)(ProviderSearchBar);