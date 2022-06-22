import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { providerFields, providerFormTypes, providerCategoryValue2Key } from '../../constants/provider_fields.js'
import { defaultProfileFields, defaultContactFields } from '../../constants/default_fields.js'
import {
  operationHourObjectToList
} from '../../helpers/operation_hour_helpers';
import { provider_verify_form } from "../../helpers/provider_verify_form";

import { useHistory, useParams } from 'react-router';
import { createProvider, updateProvider, fetchProvider } from '../../api/mockedApi/providers';
import { fetchOntologyCategories } from '../../api/mockedApi/ontologies';
import { fetchProviderFields } from '../../api/mockedApi/providerFields';

// components
import FieldGroup from '../shared/FieldGroup';
import OperationHoursFieldGroup from '../shared/OperationHoursFieldGroup';
import LocationFieldGroup from '../shared/LocationFieldGroup';

import { generateProviderFields } from "../../constants/default_fields";
import { FormStepper, Loading, FieldsWrapper, OtherLocationsFields } from "../shared";
import { Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import GeneralField from "../shared/fields/GeneralField";

const useStyles = makeStyles(theme => ({
  content: {
    width: '80%',
    margin: 'auto',
    paddingBottom: 10,
  },
  addressPaper: {
    position: 'relative',
    paddingLeft: 28,
    paddingBottom: 20,
    width: 380,
  }
}));

export default function ProviderForm() {
  const classes = useStyles();
  const history = useHistory();
  const {id, formType: category} = useParams();
  const mode = id ? 'edit' : 'new';
  const [state, setState] = useState({
    loading: true,
    category: category,
    languageOptions: [],
    eligibilities: [],
    stepNames: [],
    steps: [],
    provider: null,
    dispatchErrorMsg: [],
    fieldErrorMsg: {},
  });

  /**
   * Provider Type
   * @type {('Organization', 'Individual')}
   */
  const providerType = useMemo(() => {
    if (mode === 'new')
      return category === 'organization' ? 'Organization' : 'Individual';
    else {
      if (state.provider) return state.provider.category === 'organization' ? 'Organization' : 'Individual';
    }
  }, [state.provider, category, mode]);

  // DO NOT store form as state, it degrades the performance as all form got rendered every time user type anything.
  // Instead, for large form like this page, store the form as a variable and pass it to child components (input)
  const form = useMemo(() =>
      generateProviderFields(providerType, state.category, state.provider),
    [providerType, state.category, state.provider]);

  const load = useCallback((category) => {
    console.log(category);
    const promises = [];
    promises.push(fetchOntologyCategories('languages')
      .then(data => setState(state => ({...state, languageOptions: data}))));
    promises.push(fetchProviderFields()
      .then(data => {
        console.log('provider form', data)
        // no fields is available
        if (data[category] == null || data[category].steps_order.length === 0
          || Object.values(data[category].form_structure).length === 0) {
          setState(state => ({...state, loading: true, errorMessage: ['No fields are available.']}));
        } else {
          setState(state => ({
            ...state,
            stepNames: data[category].steps_order,
            steps: Object.values(data[category].form_structure)
          }));
        }
      }));
    Promise.all(promises).then(() => setState(state => ({...state, loading: false})));
  }, []);

  useEffect(() => {
    // load provider first if editing
    if (id) {
      fetchProvider(id)
        .then((provider) => {
          console.log(provider)
          const cat = provider.type === 'Organization' ? 'organization' : providerCategoryValue2Key[provider.category];
          setState(state => ({...state, provider: provider, category: cat}));
          load(cat);
        });
    } else {
      load(category);
    }
  }, [id, category, load]);

  const handleFinish = async () => {
    const newForm = {...form};
    newForm['operation_hours'] = operationHourObjectToList(newForm['operation_hours']);
    if (newForm.status === '') newForm.status = undefined;
    console.log(newForm);
    // TODO: pretty error message
    const fieldErrorMsg = provider_verify_form(form, state.steps);
    if (Object.keys(fieldErrorMsg).length !== 0) {
      setState(state => ({...state, fieldErrorMsg}));
      return;
    }
    if (mode === 'edit') {
      const res = await updateProvider(id, newForm);
      if (res.success) {
        history.push(`/providers/${res.providerId}`);
      } else {
        setState(state => ({...state, errorMessage: [res.error]}));
      }
    } else {
      const res = await createProvider(newForm);
      if (res.success) {
        history.push(`/providers/${res.providerId}`);
      } else {
        setState(state => ({...state, errorMessage: [res.error]}));
      }
    }
  };

  /**
   * Handle changes in form
   * @param name {string}
   * @returns {Function}
   */
  const handleChange = useCallback(name => e => {
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
  }, [form]);

  const getStepContent = idx => {
    const step = state.steps[idx];
    if (!step) return null;
    return <div className={classes.content}>
      {Object.entries(step).map(([field, required]) => {
        // The field is not a normal field, i.e. questions
        // const isQuestion = typeof required === 'object';

        let options;
        const errMsg = state.fieldErrorMsg[field];
        if (field === 'languages') {
          options = state.languageOptions;
        }

        if (field === 'main_address') {
          return (
            <FieldsWrapper label="Main address" key={field}>
              <LocationFieldGroup
                address={form.main_address}
                required={required}
                errMsg={errMsg}
              />
            </FieldsWrapper>
          );
        } else if (field === 'other_addresses') {
          return (
            <OtherLocationsFields
              key={field}
              otherLocations={form.other_addresses}
              required={required}
              errMsg={errMsg}
            />
          );
        } else if (field === 'primary_contact' || field === 'secondary_contact') {
          return (
            <FieldsWrapper key={field} label={providerFields[field].label}>
              {Object.keys(defaultContactFields).map(contactField => {
                return (
                  <FieldGroup
                    key={contactField}
                    label={providerFields[contactField]['label']}
                    type={providerFields[contactField]['type']}
                    component={providerFields[contactField]['component']}
                    value={form[field]['profile'][contactField]}
                    onChange={handleChange(field + '.' + contactField)}
                    error={errMsg == null ? false : errMsg[contactField] != null}
                    helperText={!!errMsg ? errMsg[contactField] : null}
                  />
                )
              })}
            </FieldsWrapper>
          )
        } else if (field === 'availability') {
          return (
            <OperationHoursFieldGroup
              key={field}
              operationHours={form.operation_hours}
              operationDates={form.operation_dates}
              errMsg={errMsg}
            />
          )
        } else if (field === 'notes') {
          return (
            <GeneralField
              key={field}
              label={providerFields[field].label}
              value={form[field]}
              onChange={handleChange(field)}
              required={required}
              multiline
              variant="outlined"
              fullWidth
              error={errMsg != null}
              helperText={errMsg}
            />
          )
        } else {
          const isProfile = Object.keys(defaultProfileFields).includes(field);
          // only individual has field "profile"
          if (isProfile && providerType !== "Individual") return null;
          let fieldProps = providerFields[field];
          if (fieldProps == null) fieldProps = {};
          return (
            <FieldGroup
              key={field}
              label={providerFields[field].label}
              type={providerFields[field].type}
              component={providerFields[field].component}
              value={isProfile ? form.profile[field] : form[field]}
              onChange={handleChange(isProfile ? 'profile.' + field : field)}
              required={required}
              options={providerFields[field].options || options}
              error={errMsg != null}
              helperText={errMsg}
            />
          );
        }
      })}
    </div>
  };

  if (state.loading)
    return <Loading message={`Loading...`}/>;

  console.log(state.category);
  return (
    <Container>
      <FormStepper
        getStepContent={getStepContent}
        handleFinish={handleFinish}
        stepNames={state.stepNames}
        error={state.dispatchErrorMsg}
        title={(mode === 'new' ? 'Create ' : 'Edit ') + providerFormTypes[state.category]}
      />
    </Container>
  );
}
