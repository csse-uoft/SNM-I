import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import FieldGroup from '../shared/FieldGroup';

import { Box, Container } from '@mui/material';
import { Loading, FormStepper } from "../shared";
import {
  getDynamicForm,
  getDynamicFormsByFormType,
  getInstancesInClass
} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import GeneralField from "../shared/fields/GeneralField";
import { createClient, fetchClient, updateClient } from "../../api/clientApi";

const contentStyle = {
  width: '80%',
  margin: 'auto',
  paddingBottom: '10px'
};

export default function ClientForm() {
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

        // Preselect the first form
        const firstForm = forms[0];
        setForm({formId: firstForm._id, fields: {}});
        setSelectedFormId(firstForm._id);
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

    console.log(form)
    if (mode === 'new') {
      createClient(form);
    } else {
      updateClient(form);
    }

  };

  const handleChange = typeAndId => (e) => {
    form.fields[typeAndId] = e?.target?.value || e;
    console.log(e?.target?.value || e)
  }

  const getStepContent = stepIdx => {
    console.log('render step ', stepIdx)
    const step = dynamicForm.formStructure[stepIdx].fields;
    return <Box sx={contentStyle}>
      {step.map(({required, id, type, implementation, content}, index) => {

        if (type === 'question') {
          return <GeneralField key={index} label={content} value={form.fields[`${type}_${id}`]}
                               onChange={handleChange(`${type}_${id}`)}/>
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

          return <FieldGroup component={fieldType} key={`${type}_${id}`} label={label} required={required}
                             options={fieldOptions}
                             value={form.fields[`${type}_${id}`]} onChange={handleChange(`${type}_${id}`)}/>
        }
      })}
    </Box>
  };

  if (loading)
    return <Loading message={`Loading...`}/>;

  return (
    <Container>
      <SelectField
        label="Select a form"
        value={selectedFormId}
        onChange={e => {
          setForm({formId: e.target.value, fields: {}});
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
