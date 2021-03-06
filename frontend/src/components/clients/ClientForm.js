import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import { clientFields } from '../../constants/client_fields.js'
import { defaultProfileFields, generateClientField } from '../../constants/default_fields.js'

import { fetchOntologyCategories } from '../../api/mockedApi/ontologies';
import { createClient, updateClient, fetchClient } from '../../api/mockedApi/clients';
import { fetchEligibilities } from '../../api/mockedApi/eligibility';
import { fetchClientFields } from '../../api/mockedApi/clientFields';

// components
import LocationFieldGroup from '../shared/LocationFieldGroup';
import FamilyFields from './client_form/FamilyFields';
import FieldGroup from '../shared/FieldGroup';

import { Container } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { Loading, FormStepper } from "../shared";
import { client_verify_form } from '../../helpers/client_verify_form.js';

const useStyles = makeStyles(theme => ({
  content: {
    width: '80%',
    margin: 'auto',
    paddingBottom: 10,
  }
}));

export default function ClientForm() {
  const classes = useStyles();
  const history = useHistory();
  const {id} = useParams();
  const mode = id ? 'edit' : 'new';
  const [state, setState] = useState({
    loading: true,
    languageOptions: [],
    all_ngo_conditions: [],
    stepNames: [],
    steps: [],
    client: null,
    dispatchErrorMsg: [],
    fieldErrorMsg: {},
  });

  // DO NOT store form as state, it degrades the performance as all form got rendered every time user type anything.
  // Instead, for large form like this page, store the form as a variable and pass it to child components (input)
  const form = useMemo(() => generateClientField(state.client), [state.client]);

  // const [form, setForm] = useState(generateClientField());

  useEffect(() => {
    const promises = [];
    promises.push(fetchOntologyCategories('languages')
      .then(data => setState(state => ({...state, languageOptions: data}))));
    promises.push(fetchEligibilities()
      .then(data => {
        setState(state => ({...state, all_ngo_conditions: data.map(data => data.title)}))
      }));
    promises.push(fetchClientFields()
      .then(data => {
        if (data == null || data.steps_order.length === 0
          || Object.values(data.form_structure).length === 0) {
          setState(state => ({...state, loading: true, dispatchErrorMsg: ['No fields are available.']}));
        } else {
          setState(state => ({
            ...state,
            stepNames: data.steps_order,
            steps: Object.values(data.form_structure)
          }));
        }
      }));
    id && promises.push(fetchClient(id)
      .then(data => setState(state => ({...state, client: data}))));
    Promise.all(promises).then(() => setState(state => ({...state, loading: false})));
  }, [id]);

  const handleFinish = async () => {
    // TODO: pretty error message
    const fieldErrorMsg = client_verify_form(form, state.steps);
    if (Object.keys(fieldErrorMsg).length !== 0) {
      setState(state => ({...state, fieldErrorMsg}));
      return;
    }
    if (mode === 'edit') {
      const res = await updateClient(id, form);
      if (res.success) {
        history.push(`/clients/${res.clientId}`);
      } else {
        setState(state => ({...state, dispatchErrorMsg: [res.error]}));
      }
    } else {
      const res = await createClient(form);
      if (res.success) {
        history.push(`/clients/${res.clientId}`);
      } else {
        setState(state => ({...state, dispatchErrorMsg: [res.error]}));
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
    return <div className={classes.content}>
      {Object.entries(step).map(([field, required]) => {
        let options;
        // console.log(field)
        let errMsg = state.fieldErrorMsg[field];
        if (field === 'first_language') {
          options = state.languageOptions;
        } else if (field === 'other_languages') {
          options = state.languageOptions.filter(
            category => category !== form.first_language)
        } else if (field === 'ngo_conditions') {
          options = state.all_ngo_conditions;
        }

        if (field === 'address') {
          return (
            <LocationFieldGroup
              key="address"
              address={form.address}
              required={required}
              errMsg={errMsg}
            />
          );
        } else if (field === 'family') {
          return (
            <FamilyFields
              key="family"
              family={form.family}
              clientId={id}
              required={required}
              errMsg={errMsg}
            />
          );
        } else {
          const isProfile = Object.keys(defaultProfileFields).includes(field);
          return (
            <FieldGroup
              key={field}
              label={clientFields[field].label}
              type={clientFields[field].type}
              component={clientFields[field].component}
              value={isProfile ? form.profile[field] : form[field]}
              onChange={handleChange(isProfile ? 'profile.' + field : field)}
              required={required}
              options={clientFields[field].options || options}
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

  return (
    <Container>
      <FormStepper
        getStepContent={getStepContent}
        handleFinish={handleFinish}
        stepNames={state.stepNames}
        error={state.dispatchErrorMsg}
      />
    </Container>
  );
}
