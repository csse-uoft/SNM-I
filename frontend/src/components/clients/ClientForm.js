import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
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
import {
  getAllDynamicForms,
  getDynamicForm,
  getDynamicFormsByFormType,
  getInstancesInClass
} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import GeneralField from "../shared/fields/GeneralField";

const useStyles = makeStyles(theme => ({
  content: {
    width: '80%',
    margin: 'auto',
    paddingBottom: 10,
  }
}));

export default function ClientForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const {id} = useParams();
  const mode = id ? 'edit' : 'new';

  const [state, setState] = useState({
    languageOptions: [],
    all_ngo_conditions: [],
    steps: [],
    client: null,
    dispatchErrorMsg: [],
    fieldErrorMsg: {},
  });

  const [form, setForm] = useState({});
  const [allForms, setAllForms] = useState({});

  const [selectedFormId, setSelectedFormId] = useState('');
  const [dynamicForm, setDynamicForm] = useState({formStructure: []});
  const [dynamicOptions, setDynamicOptions] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDynamicFormsByFormType('client').then(({forms}) => {
        const allForms = {};
        forms.forEach(form => allForms[form._id] = form);
        setAllForms(forms);
      }),
    ]).then(() => {
      setLoading(false);
    });

    if (id) {
      // setForm
    }
  }, [id]);

  const formOptions = useMemo(() => {
    const options = {};
    Object.values(allForms).forEach(form => options[form._id] = form.name);
    return options
  }, [allForms]);


  useEffect(() => {
    if (selectedFormId)
      getDynamicForm(selectedFormId).then(({form}) => {
        setDynamicForm(form);
        for (const step of form.formStructure) {
          for (const field of step.fields) {
            const className = field?.implementation?.optionsFromClass;
            if (className) {
              getInstancesInClass(className)
                .then(options => setDynamicOptions(prev => ({...prev, [className]: options})))
            }
          }
        }
      });
  }, [selectedFormId]);

  const stepNames = useMemo(() => {
    return dynamicForm.formStructure.map(s => s.stepName);
  }, [dynamicForm]);

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
        navigate(`/clients/${res.clientId}`);
      } else {
        setState(state => ({...state, dispatchErrorMsg: [res.error]}));
      }
    } else {
      const res = await createClient(form);
      if (res.success) {
        navigate(`/clients/${res.clientId}`);
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
    console.log('render step ', idx)
    const step = dynamicForm.formStructure[idx].fields;
    return <div className={classes.content}>
      {step.map(({required, id, type, implementation, content}, index) => {

        if (type === 'question') {
          return <GeneralField key={index} label={content}/>
        } else if (type === 'characteristic') {
          const fieldType = implementation.fieldType.type;
          const {label, optionsFromClass} = implementation;

          let fieldOptions;
          if (optionsFromClass) {
            fieldOptions = dynamicOptions[optionsFromClass] || {};
          } else if (implementation.options) {
            fieldOptions = {};
            implementation.options.forEach(option => fieldOptions[option._id] = option.label);
          }

          return <FieldGroup component={fieldType} key={index} label={label} required={required} options={fieldOptions}
                             onChange={() => {
                             }}/>
        }

        // let options;
        // // console.log(field)
        // let errMsg = state.fieldErrorMsg[field];
        // if (field === 'first_language') {
        //   options = state.languageOptions;
        // } else if (field === 'other_languages') {
        //   options = state.languageOptions.filter(
        //     category => category !== form.first_language)
        // } else if (field === 'ngo_conditions') {
        //   options = state.all_ngo_conditions;
        // }
        //
        // if (field === 'address') {
        //   return (
        //     <LocationFieldGroup
        //       key="address"
        //       address={form.address}
        //       required={required}
        //       errMsg={errMsg}
        //     />
        //   );
        // } else if (field === 'family') {
        //   return (
        //     <FamilyFields
        //       key="family"
        //       family={form.family}
        //       clientId={id}
        //       required={required}
        //       errMsg={errMsg}
        //     />
        //   );
        // } else {
        //   const isProfile = Object.keys(defaultProfileFields).includes(field);
        //   return (
        //     <FieldGroup
        //       key={field}
        //       label={clientFields[field].label}
        //       type={clientFields[field].type}
        //       component={clientFields[field].component}
        //       value={isProfile ? form.profile[field] : form[field]}
        //       onChange={handleChange(isProfile ? 'profile.' + field : field)}
        //       required={required}
        //       options={clientFields[field].options || options}
        //       error={errMsg != null}
        //       helperText={errMsg}
        //     />
        //   );
        // }
      })}
    </div>
  };

  if (loading)
    return <Loading message={`Loading...`}/>;

  return (
    <Container>
      <SelectField
        label="Select a form"
        value={selectedFormId}
        onChange={e => {
          setSelectedFormId(e.target.value);
        }}
        options={formOptions}
        sx={{mb: 2}}
        noEmpty
      />
      <FormStepper
        getStepContent={getStepContent}
        handleFinish={handleFinish}
        stepNames={stepNames}
        error={state.dispatchErrorMsg}
      />
    </Container>
  );
}
