import _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from '../shared';
import { fetchOntologyCategories } from '../../api/mockedApi/ontologies';
import {
  statusInCanadaOptions, educationLevelOptions,
  serviceSharedWithOptions, serviceTypeOptions
} from '../../store/defaults'
import GeneralField from '../shared/fields/GeneralField'
import SelectField from '../shared/fields/SelectField'
import RadioField from '../shared/fields/RadioField'
import MultiSelectField from '../shared/fields/MultiSelectField';
import { formatLocation } from '../../helpers/location_helpers.js';
import { Validator } from "../../helpers";

// redux
import { connect } from 'react-redux'
import { createService, updateService } from '../../api/mockedApi/services'
import { fetchProviders } from '../../api/mockedApi/providers';
import { ACTION_SUCCESS } from '../../store/defaults.js';

import { Container, Divider, Typography, Button, Alert } from "@mui/material";
import { withStyles } from "@mui/styles";
import LocationFieldGroup from "../shared/LocationFieldGroup";
import EligibilityCondition from './EligibilityCondition'
import { transformToBackendType, transformToFrontendType } from '../../helpers/formulaHelpers';

const styles = {
  root: {
    width: '80%'
  },
  divider: {
    margin: '20px 0',
  },
  errorText: {
    color: '#e41919'
  },
  title: {
    fontWeight: 600,
  }
};

class ServiceForm extends Component {
  constructor(props) {
    super(props);
    let service = {};
    if (this.props.match.params.id) {
      service = this.props.servicesById[this.props.match.params.id];
    }

    this.state = {
      errors: {},
      serviceId: service.id,
      mode: (service.id) ? 'edit' : 'new',
      form: {
        name: service.name || '',
        type: service.type || '',
        desc: service.desc || '',
        category: service.category || '',
        available_from: service.available_from || '',
        available_to: service.available_to || '',
        languages: service.languages || [],
        max_capacity: service.max_capacity || '',
        current_capacity: service.current_capacity || 0,
        frequency: service.frequency || '',
        billable: service.billable || 'No',
        price: service.price || '',
        method_of_delivery: service.method_of_delivery || '',
        method_of_registration: service.method_of_registration || '',
        registration: service.registration || '',
        email: service.email || '',
        primary_phone_number: service.primary_phone_number || '',
        alt_phone_number: service.alt_phone_number || '',
        location: Object.assign({
          id: '',
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
        }, service.location),
        location_same_as_provider: service.location_same_as_provider || false,
        share_with: service.share_with || [],
        notes: service.notes || '',
        eligibility_conditions: Object.assign({
          'upper_age_limit': '',
          'lower_age_limit': '',
          'immigration_status': [],
          'current_education_level': [],
          'completed_education_level': []
        }, service.eligibility_conditions),
        provider_id: (service.provider && service.provider.id) || '',
        is_public: service.is_public || false,
        /**
         * @type {[{condition_clauses: [field_name, clauses: [{left_operand, right_operand, operator}]]}]}
         **/
        eligibility_criteria: transformToFrontendType(service.eligibility_criteria) || []
      }
    };

    this.props.dispatch(fetchOntologyCategories('services'));
    this.props.dispatch(fetchOntologyCategories('languages'));
    this.props.dispatch(fetchProviders());
  }

  formValChange = (name, render) => e => {
    const {value} = e.target;
    const splits = name.split('.');
    const {form} = this.state;
    if (splits.length === 1) {
      form[name] = value;
    } else {
      let parent = this.state.form;
      for (let i = 0; i < splits.length - 1; i++) {
        parent = parent[splits[i]];
      }
      parent[splits[splits.length - 1]] = value || '';
    }
    if (render) this.setState(state => ({form: {...state.form}}));
  };

  submit = () => {
    console.log(this.state.form);
    let form = Object.assign({}, this.state.form);
    form['eligibility_conditions']['age'] = [
      form['eligibility_conditions']['lower_age_limit'] || null,
      form['eligibility_conditions']['upper_age_limit'] || null
    ];
    delete form['eligibility_conditions']['lower_age_limit'];
    delete form['eligibility_conditions']['upper_age_limit'];

    form.eligibility_criteria = transformToBackendType(form.eligibility_criteria);

    if (this.validateForm()) {
      if (this.state.mode === 'edit') {
        this.props.dispatch(
          updateService(this.state.serviceId, form, (status, err, serviceId) => {
            if (status === ACTION_SUCCESS) {
              this.props.history.push('/services');
              this.forceUpdate()
            }
          }));
      } else {
        this.props.dispatch(
          createService(this.state.form, (status, err, serviceId) => {
            this.props.history.push('/services');
            this.forceUpdate()
          }));
      }
    }
  };

  validateForm = () => {

    let errors = {};
    let formIsValid = true;
    if (!this.state.form.provider_id) {
      formIsValid = false;
      errors["provider_id"] = "*Please enter a provider.";
    }

    if (!this.state.form.type) {
      formIsValid = false;
      errors["type"] = "*Please enter the type.";
    }

    if (!this.state.form.name) {
      formIsValid = false;
      errors["name"] = "*Please enter the name.";
    }

    if (!this.state.form.category) {
      formIsValid = false;
      errors["category"] = "*Please enter the category.";
    }

    if (this.state.form.primary_phone_number) {
      const errMsg = Validator.phone(this.state.form.primary_phone_number);
      if (errMsg) {
        errors['primary_phone_number'] = "*" + errMsg;
      }
    }

    if (this.state.form.alt_phone_number) {
      const errMsg = Validator.phone(this.state.form.alt_phone_number);
      if (errMsg) {
        errors['alt_phone_number'] = "*" + errMsg;
      }
    }

    if (this.state.form.email) {
      const errMsg = Validator.email(this.state.form.email);
      if (errMsg) {
        errors['email'] = "*" + errMsg;
      }
    }

    if (this.state.form.location.postal_code) {
      const errMsg = Validator.postalCode(this.state.form.location.postal_code);
      if (errMsg) {
        errors['postal_code'] = "*" + errMsg;
      }
    }

    this.setState({
      errors: errors
    });

    return formIsValid;

  };

  render() {
    const {classes} = this.props;
    const p = this.props;
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Service Profile' : 'New Service';

    let provider, provider_locations;
    if (isInt(this.state.form.provider_id)) {
      // assumption: this.state.form.provider_id should be an integer
      // Delete this condition check if the assumption is no longer needed
      provider = this.props.providersById && this.props.providersById.providersById[this.state.form.provider_id];
      provider_locations = provider.other_addresses ? provider.other_addresses.concat([provider.main_address]) : []
    }

    const locations = {}, location2Obj = {};
    if (provider_locations) provider_locations.forEach((address, index) => {
      const loc = formatLocation(address);
      locations[loc] = loc;
      location2Obj[loc] = address;
    });

    return (
      <Container className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          {formTitle}
        </Typography>

        {this.state.showAlert && this.state.error_messages.map((message, index) =>
          <Alert key={index} severity="error">{message}</Alert>)}

        <Divider className={classes.divider}/>
        <Typography variant="h5">
          Service Information
        </Typography>
        <SelectField
          label="Provider"
          options={_.reduce(p.providers, (map, provider) => {
            if (provider.type === 'Individual') {
              map[provider.id] = provider.profile && provider.profile.first_name + " " + provider.profile.last_name;
            } else {
              map[provider.id] = provider.company
            }
            return map;
          }, {})}
          value={this.state.form.provider_id}
          onChange={this.formValChange('provider_id')}
          required
        />
        <div className={classes.errorText}>{this.state.errors.provider_id}</div>
        <Link to={'/providers'} color>
          <Typography>
            Add new provider
          </Typography>
        </Link>
        <SelectField
          label="Type"
          options={serviceTypeOptions}
          value={this.state.form.type}
          onChange={this.formValChange('type')}
          required
        />
        <div className={classes.errorText}>{this.state.errors.type}</div>
        <GeneralField
          label="Name"
          type="text"
          value={this.state.form.name}
          onChange={this.formValChange('name')}
          required
        />
        <div className={classes.errorText}>{this.state.errors.name}</div>
        <GeneralField
          label="Description"
          type="text"
          value={this.state.form.desc}
          onChange={this.formValChange('desc')}
        />
        <SelectField
          label="Category"
          options={p.servicesCategories}
          value={this.state.form.category}
          onChange={this.formValChange('category')}
          required
        />
        <div className={classes.errorText}>{this.state.errors.category}</div>
        <GeneralField
          label="Available from"
          type="date"
          value={this.state.form.available_from}
          onChange={this.formValChange('available_from')}
        />
        <GeneralField
          label="Available until"
          type="date"
          value={this.state.form.available_to}
          onChange={this.formValChange('available_to')}
        />
        <MultiSelectField
          label="Languages"
          options={p.languagesCategories}
          value={this.state.form.languages}
          onChange={this.formValChange('languages')}
        />
        <GeneralField
          label="Max Capacity"
          type="number"
          value={this.state.form.max_capacity}
          min="0"
          onChange={this.formValChange('max_capacity')}
        />
        {parseInt(this.state.form.max_capacity, 10) > 0 &&
        <GeneralField
          label="Current Capacity"
          type="number"
          value={this.state.form.current_capacity}
          min="0"
          onChange={this.formValChange('current_capacity')}
        />
        }
        <SelectField
          label="Frequency"
          value={this.state.form.frequency}
          onChange={this.formValChange('frequency')}
          options={['Weekly', 'Biweekly', 'Monthly', 'Non-repeated']}
        />
        <RadioField
          label="Billable"
          value={this.state.form.billable}
          onChange={this.formValChange('billable', true)}
          options={{Yes: 'Yes', No: 'No'}}
        >
        </RadioField>

        {this.state.form.billable === "Yes" &&
        <GeneralField
          label="Price"
          type="text"
          value={this.state.form.price}
          onChange={this.formValChange('price')}
        />}

        <SelectField
          label="Method of delivery"
          value={this.state.form.method_of_delivery}
          onChange={this.formValChange('method_of_delivery')}
          options={{
            Online: 'Online',
            'One on one (In person)': 'One on one (In person)',
            Group: 'Group (In person)'
          }} // In person
        />

        <SelectField
          label="Method of registration"
          value={this.state.form.method_of_registration}
          onChange={this.formValChange('method_of_registration')}
          options={['Self registration', 'Registration by social worker', 'No registration']}
        />

        <SelectField
          label="Registration"
          placeholder="select"
          value={this.state.form.registration}
          onChange={this.formValChange('registration')}
          options={['Online', 'In person', 'By phone']}
        />

        <Divider className={classes.divider}/>
        <Typography variant="h5">
          Eligibility
        </Typography>
        <EligibilityCondition
          value={this.state.form.eligibility_criteria}
          formValChange={this.formValChange('eligibility_criteria')}
        />
        <MultiSelectField
          label="Immigration Status"
          options={statusInCanadaOptions}
          value={this.state.form.eligibility_conditions.immigration_status}
          onChange={this.formValChange('eligibility_conditions.immigration_status')}
        />
        <GeneralField
          label="Age greater than"
          type="text"
          value={this.state.form.eligibility_conditions.lower_age_limit}
          onChange={this.formValChange('eligibility_conditions.lower_age_limit')}
        />
        <GeneralField
          id="upper_age_limit"
          label="Age less than"
          type="text"
          value={this.state.form.eligibility_conditions.upper_age_limit}
          onChange={this.formValChange('eligibility_conditions.upper_age_limit')}
        />
        <MultiSelectField
          label="Current Education"
          options={educationLevelOptions}
          value={this.state.form.eligibility_conditions.current_education_level}
          onChange={this.formValChange('eligibility_conditions.current_education_level')}
        />
        <MultiSelectField
          label="Completed Education Level"
          options={educationLevelOptions}
          value={this.state.form.eligibility_conditions.completed_education_level}
          onChange={this.formValChange('eligibility_conditions.completed_education_level')}
        />
        <Divider className={classes.divider}/>
        <Typography variant="h5">
          Contact Information
        </Typography>
        <GeneralField
          label="Contact Person Email"
          type="email"
          value={this.state.form.email}
          onChange={this.formValChange('email')}
        />
        <div className={classes.errorText}>{this.state.errors.email}</div>
        <GeneralField
          label="Telephone"
          type="tel"
          value={this.state.form.primary_phone_number}
          onChange={this.formValChange('primary_phone_number')}
        />
        <div className={classes.errorText}>{this.state.errors.primary_phone_number}</div>
        <GeneralField
          label="Alternative Phone Number"
          type="tel"
          value={this.state.form.alt_phone_number}
          onChange={this.formValChange('alt_phone_number')}
        />
        <div className={classes.errorText}>{this.state.errors.alt_phone_number}</div>
        <RadioField
          label="Location"
          options={{'Same as provider': true, 'Other': false}}
          onChange={this.formValChange('location_same_as_provider', true)}
          value={this.state.form.location_same_as_provider}
        />

        {this.state.form.location_same_as_provider && this.state.form.provider_id &&
        <div>
          <RadioField
            label="Select the location this service is provided at"
            value={this.state.form.location}
            options={locations}
            onChange={(e) => {
              const {form} = this.state;
              form.location = {...locations[e.target.value]};
              this.formValChange('location');
            }}
          />
          {!_.includes(_.map(provider_locations, 'id'), this.state.form.location.id) &&
          <Typography style={{marginTop: 10}}>
            {`The current location of service is at
                          ${formatLocation(this.state.form.location)}, which has
                          been removed from provider locations. Please select a
                          new location.`}
          </Typography>
          }
        </div>
        }
        {!this.state.form.location_same_as_provider &&
        <LocationFieldGroup
          key="address"
          address={this.state.form.location}
          errMsg={this.state.errors}
        />
        }
        <RadioField
          label="Public?"
          options={{'Yes': true, 'No': false}}
          onChange={this.formValChange('is_public')}
          value={this.state.form.is_public}
        />
        <Divider className={classes.divider}/>
        <Typography variant="h5">
          Other Information
        </Typography>
        <MultiSelectField
          label="Share with"
          options={serviceSharedWithOptions}
          value={this.state.form.share_with}
          onChange={this.formValChange('share_with')}
        />
        <GeneralField
          label="Notes"
          type="text"
          value={this.state.form.notes}
          onChange={this.formValChange('notes')}
          multiline
          variant="outlined"
          fullWidth
        />
        <Button onClick={this.submit} variant="outlined" color="primary" style={{margin: '12px 0'}}>
          Submit
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    servicesById: state.services.byId,
    servicesCategories: state.ontology.services.categories,
    categoriesLoaded: state.ontology.services.loaded,
    languagesCategories: state.ontology.languages.categories,
    languagesLoaded: state.ontology.languages.loaded,
    providers: state.providers.filteredProviders || [],
    providersById: state.providers.byId,
    providersLoaded: state.providers.loaded,
    providerIndex: state.providers.index
  }
};

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) === value && 
         !isNaN(parseInt(value, 10));
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(ServiceForm)));
