import _ from 'lodash';
import React, { Component, useEffect, useState } from 'react';
import { useParams, withRouter } from "react-router-dom";
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
import { makeStyles } from "@mui/styles";
import LocationFieldGroup from "../shared/AddressFieldField";
import EligibilityCondition from './EligibilityCondition'
import { transformToBackendType, transformToFrontendType } from '../../helpers/formulaHelpers';

const useStyles = makeStyles({
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
});

function ServiceForm() {

  const classes = useStyles();
  const {id} = useParams();
  const mode = id ? 'edit' : 'new';
  const [errors, setErrors] = useState({});

  const service = {};

  const [form, setForm] = useState(
    {
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
  );

  const [serviceCategory, setServiceCategory] = useState([]);
  const [languageCategory, setLanguageCategory] = useState([]);
  const [providers, setProviders] = useState([])

  useEffect(() => {
    Promise.all([
      fetchOntologyCategories('services').then(setServiceCategory),
      fetchOntologyCategories('languages').then(setLanguageCategory),
      fetchProviders().then(setProviders)
    ]);
  }, [id]);


  const formValChange = (name, render) => e => {
    const {value} = e.target;
    const splits = name.split('.');
    if (splits.length === 1) {
      form[name] = value;
    } else {
      let parent = form;
      for (let i = 0; i < splits.length - 1; i++) {
        parent = parent[splits[i]];
      }
      parent[splits[splits.length - 1]] = value || '';
    }
    if (render) setForm({...form});
    console.log(form)
  };

  const submit = () => {
    console.log(form);
    let form = Object.assign({}, form);
    form['eligibility_conditions']['age'] = [
      form['eligibility_conditions']['lower_age_limit'] || null,
      form['eligibility_conditions']['upper_age_limit'] || null
    ];
    delete form['eligibility_conditions']['lower_age_limit'];
    delete form['eligibility_conditions']['upper_age_limit'];

    form.eligibility_criteria = transformToBackendType(form.eligibility_criteria);

    if (validateForm()) {
      if (mode === 'edit') {
        updateService(id, form, (status, err, serviceId) => {
          if (status === ACTION_SUCCESS) {
            this.props.navigate('/services');
            this.forceUpdate()
          }
        })
      } else {
        createService(form, (status, err, serviceId) => {
          this.props.navigate('/services');
          this.forceUpdate()
        });
      }
    }
  };

  const validateForm = () => {

    let errors = {};
    let formIsValid = true;
    if (!form.provider_id) {
      formIsValid = false;
      errors["provider_id"] = "*Please enter a provider.";
    }

    if (!form.type) {
      formIsValid = false;
      errors["type"] = "*Please enter the type.";
    }

    if (!form.name) {
      formIsValid = false;
      errors["name"] = "*Please enter the name.";
    }

    if (!form.category) {
      formIsValid = false;
      errors["category"] = "*Please enter the category.";
    }

    if (form.primary_phone_number) {
      const errMsg = Validator.phone(form.primary_phone_number);
      if (errMsg) {
        errors['primary_phone_number'] = "*" + errMsg;
      }
    }

    if (form.alt_phone_number) {
      const errMsg = Validator.phone(form.alt_phone_number);
      if (errMsg) {
        errors['alt_phone_number'] = "*" + errMsg;
      }
    }

    if (form.email) {
      const errMsg = Validator.email(form.email);
      if (errMsg) {
        errors['email'] = "*" + errMsg;
      }
    }

    if (form.location.postal_code) {
      const errMsg = Validator.postalCode(form.location.postal_code);
      if (errMsg) {
        errors['postal_code'] = "*" + errMsg;
      }
    }

    setErrors(errors);

    return formIsValid;
  }

  const formTitle = (mode === 'edit') ?
    'Edit Service Profile' : 'New Service';

  let provider, provider_locations;
  if (isInt(form.provider_id)) {
    // assumption: form.provider_id should be an integer
    // Delete this condition check if the assumption is no longer needed
    provider = this.props.providersById && this.props.providersById.providersById[form.provider_id];
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

      {/*{this.state.showAlert && this.state.error_messages.map((message, index) =>*/}
      {/*  <Alert key={index} severity="error">{message}</Alert>)}*/}

      <Divider className={classes.divider}/>
      <Typography variant="h5">
        Service Information
      </Typography>
      <SelectField
        label="Provider"
        options={_.reduce(providers, (map, provider) => {
          if (provider.type === 'Individual') {
            map[provider.id] = provider.profile && provider.profile.first_name + " " + provider.profile.last_name;
          } else {
            map[provider.id] = provider.company
          }
          return map;
        }, {})}
        value={form.provider_id}
        onChange={formValChange('provider_id')}
        required
      />
      <div className={classes.errorText}>{errors.provider_id}</div>
      <Link to={'/providers'} color>
        <Typography>
          Add new provider
        </Typography>
      </Link>
      <SelectField
        label="Type"
        options={serviceTypeOptions}
        value={form.type}
        onChange={formValChange('type')}
        required
      />
      <div className={classes.errorText}>{errors.type}</div>
      <GeneralField
        label="Name"
        type="text"
        value={form.name}
        onChange={formValChange('name')}
        required
      />
      <div className={classes.errorText}>{errors.name}</div>
      <GeneralField
        label="Description"
        type="text"
        value={form.desc}
        onChange={formValChange('desc')}
      />
      <SelectField
        label="Category"
        options={serviceCategory}
        value={form.category}
        onChange={formValChange('category')}
        required
      />
      <div className={classes.errorText}>{errors.category}</div>
      <GeneralField
        label="Available from"
        type="date"
        value={form.available_from}
        onChange={formValChange('available_from')}
      />
      <GeneralField
        label="Available until"
        type="date"
        value={form.available_to}
        onChange={formValChange('available_to')}
      />
      <MultiSelectField
        label="Languages"
        options={languageCategory}
        value={form.languages}
        onChange={formValChange('languages')}
      />
      <GeneralField
        label="Max Capacity"
        type="number"
        value={form.max_capacity}
        min="0"
        onChange={formValChange('max_capacity')}
      />
      {parseInt(form.max_capacity, 10) > 0 &&
        <GeneralField
          label="Current Capacity"
          type="number"
          value={form.current_capacity}
          min="0"
          onChange={formValChange('current_capacity')}
        />
      }
      <SelectField
        label="Frequency"
        value={form.frequency}
        onChange={formValChange('frequency')}
        options={['Weekly', 'Biweekly', 'Monthly', 'Non-repeated']}
      />
      <RadioField
        label="Billable"
        value={form.billable}
        onChange={formValChange('billable', true)}
        options={{Yes: 'Yes', No: 'No'}}
      >
      </RadioField>

      {form.billable === "Yes" &&
        <GeneralField
          label="Price"
          type="text"
          value={form.price}
          onChange={formValChange('price')}
        />}

      <SelectField
        label="Method of delivery"
        value={form.method_of_delivery}
        onChange={formValChange('method_of_delivery')}
        options={{
          Online: 'Online',
          'One on one (In person)': 'One on one (In person)',
          Group: 'Group (In person)'
        }} // In person
      />

      <SelectField
        label="Method of registration"
        value={form.method_of_registration}
        onChange={formValChange('method_of_registration')}
        options={['Self registration', 'Registration by social worker', 'No registration']}
      />

      <SelectField
        label="Registration"
        placeholder="select"
        value={form.registration}
        onChange={formValChange('registration')}
        options={['Online', 'In person', 'By phone']}
      />

      <Divider className={classes.divider}/>
      <Typography variant="h5">
        Eligibility
      </Typography>
      <EligibilityCondition
        value={form.eligibility_criteria}
        formValChange={formValChange('eligibility_criteria')}
      />
      <MultiSelectField
        label="Immigration Status"
        options={statusInCanadaOptions}
        value={form.eligibility_conditions.immigration_status}
        onChange={formValChange('eligibility_conditions.immigration_status')}
      />
      <GeneralField
        label="Age greater than"
        type="text"
        value={form.eligibility_conditions.lower_age_limit}
        onChange={formValChange('eligibility_conditions.lower_age_limit')}
      />
      <GeneralField
        id="upper_age_limit"
        label="Age less than"
        type="text"
        value={form.eligibility_conditions.upper_age_limit}
        onChange={formValChange('eligibility_conditions.upper_age_limit')}
      />
      <MultiSelectField
        label="Current Education"
        options={educationLevelOptions}
        value={form.eligibility_conditions.current_education_level}
        onChange={formValChange('eligibility_conditions.current_education_level')}
      />
      <MultiSelectField
        label="Completed Education Level"
        options={educationLevelOptions}
        value={form.eligibility_conditions.completed_education_level}
        onChange={formValChange('eligibility_conditions.completed_education_level')}
      />
      <Divider className={classes.divider}/>
      <Typography variant="h5">
        Contact Information
      </Typography>
      <GeneralField
        label="Contact Person Email"
        type="email"
        value={form.email}
        onChange={formValChange('email')}
      />
      <div className={classes.errorText}>{errors.email}</div>
      <GeneralField
        label="Telephone"
        type="tel"
        value={form.primary_phone_number}
        onChange={formValChange('primary_phone_number')}
      />
      <div className={classes.errorText}>{errors.primary_phone_number}</div>
      <GeneralField
        label="Alternative Phone Number"
        type="tel"
        value={form.alt_phone_number}
        onChange={formValChange('alt_phone_number')}
      />
      <div className={classes.errorText}>{errors.alt_phone_number}</div>
      <RadioField
        label="Location"
        options={{'Same as provider': true, 'Other': false}}
        onChange={formValChange('location_same_as_provider', true)}
        value={form.location_same_as_provider}
      />

      {form.location_same_as_provider && form.provider_id &&
        <div>
          <RadioField
            label="Select the location this service is provided at"
            value={form.location}
            options={locations}
            onChange={(e) => {
              const {form} = this.state;
              form.location = {...locations[e.target.value]};
              formValChange('location');
            }}
          />
          {!_.includes(_.map(provider_locations, 'id'), form.location.id) &&
            <Typography style={{marginTop: 10}}>
              {`The current location of service is at
                          ${formatLocation(form.location)}, which has
                          been removed from provider locations. Please select a
                          new location.`}
            </Typography>
          }
        </div>
      }
      {!form.location_same_as_provider &&
        <LocationFieldGroup
          key="address"
          address={form.location}
          errMsg={errors}
        />
      }
      <RadioField
        label="Public?"
        options={{'Yes': true, 'No': false}}
        onChange={formValChange('is_public')}
        value={form.is_public}
      />
      <Divider className={classes.divider}/>
      <Typography variant="h5">
        Other Information
      </Typography>
      <MultiSelectField
        label="Share with"
        options={serviceSharedWithOptions}
        value={form.share_with}
        onChange={formValChange('share_with')}
      />
      <GeneralField
        label="Notes"
        type="text"
        value={form.notes}
        onChange={formValChange('notes')}
        multiline
        variant="outlined"
        fullWidth
      />
      <Button onClick={submit} variant="outlined" color="primary" style={{margin: '12px 0'}}>
        Submit
      </Button>
    </Container>
  );
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

export default ServiceForm;
