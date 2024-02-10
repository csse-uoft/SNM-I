import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from 'notistack';

import FieldGroup from '../shared/FieldGroup';

import {Box, Container, Typography} from '@mui/material';
import {FormStepper, Loading} from "../shared";
import {getDynamicForm, getDynamicFormsByFormType, getInstancesInClass} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import GeneralField from "../shared/fields/GeneralField";
import {createSingleGeneric, fetchSingleGeneric, updateSingleGeneric} from "../../api/genericDataApi";
import {createSingleProvider, fetchSingleProvider, updateSingleProvider} from "../../api/providersApi";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {sendPartnerReferral, updatePartnerReferral} from "../../api/partnerNetworkApi";

const contentStyle = {
  width: '80%',
  margin: 'auto',
  paddingBottom: '10px'
};

/**
 *
 * @param name
 * @param mainPage
 * @param isProvider
 * @param {({required, id, type, implementation, content}, index: number, fields, handleChange: any) => boolean | void} [onRenderField]
 *        called when rendering a field. Return the component if you want to override the default rendering logic.
 * @returns {JSX.Element}
 * @constructor
 */
export default function GenericForm({name, mainPage, isProvider, onRenderField}) {
  const navigate = useNavigate();
  const {id, clientId, needId, serviceOrProgramType, serviceOrProgramId} = useParams();
  const mode = id ? 'edit' : 'new';

  const [form, setForm] = useState({});
  const [allForms, setAllForms] = useState({});

  const [step, setStep] = useState({});

  const [selectedFormId, setSelectedFormId] = useState('');
  const [dynamicForm, setDynamicForm] = useState({formStructure: []});
  const [dynamicOptions, setDynamicOptions] = useState({});

  const [loading, setLoading] = useState(true);

  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    getDynamicFormsByFormType(name).then(({forms}) => {
      const allForms = {};
      forms.forEach(form => allForms[form._id] = form);
      setAllForms(forms);

      if (forms.length > 0) {
        // Preselect the first form
        const firstForm = forms[0];
        setForm({formId: firstForm._id, fields: {}});
        setSelectedFormId(firstForm._id);
      } else {
        setLoading(false);
      }
    });
  }, [id]);

  const formOptions = useMemo(() => {
    const options = {};
    Object.values(allForms).forEach(form => options[form._id] = form.name);
    return options;
  }, [allForms]);


  useEffect(() => {
    // Invoked only after selectedFormId is set
    if (selectedFormId) {

      (async function () {
        setLoading(true);

        // Get the form and dynamic options used in the form
        const {form} = await getDynamicForm(selectedFormId);
        setDynamicForm(form);
        for (const step of form.formStructure) {
          for (const field of step.fields) {
            const className = field?.implementation?.optionsFromClass;
            if (className) {
              if (className == 'cp:CL-Gender'){
                // parse and transform the Gender field
                await getInstancesInClass(className)
                .then(options => {
                  Object.keys(options).map(key => options[key] = options[key].replace('cp:', ''));
                  setDynamicOptions(prev => ({...prev, [className]: options}))
                });
              }
              else {
                await getInstancesInClass(className)
                .then(options => setDynamicOptions(prev => ({...prev, [className]: options})));
              }
            }
          }
        }

        if (mode === 'edit') {
          // Get data
          const {data} = await (isProvider ? fetchSingleProvider : fetchSingleGeneric)(name, id);
          setForm(form => ({...form, fields: data}));
        } else {
          // Prefill form with any given attributes
          const {internalTypes} = await fetchInternalTypeByFormType(name);
          const capitalizedType = serviceOrProgramType?.charAt(0).toUpperCase() + serviceOrProgramType?.substring(1);
          const data = {};
          for (const internalType of internalTypes) {
            if (internalType.implementation?.optionsFromClass === 'http://snmi#Client' && clientId) {
              data[internalType._uri.split('#')[1]] = "http://snmi#client_" + clientId;
            } else if (internalType.implementation?.optionsFromClass === 'http://snmi#Need' && needId) {
              data[internalType._uri.split('#')[1]] = "http://snmi#need_" + needId;
            } else if (internalType.implementation?.optionsFromClass === 'http://snmi#' + capitalizedType && serviceOrProgramId) {
              data[internalType._uri.split('#')[1]] = "http://snmi#" + serviceOrProgramType + '_' + serviceOrProgramId;
              // TODO: Add receivingServiceProvider
              // TODO: Add serviceorProgramOccurrence
            }
          }
          setForm(form => ({...form, fields: data}));
        }

        setLoading(false);
      })();
    }

  }, [selectedFormId]);

  const stepNames = useMemo(() => {
    return dynamicForm.formStructure.map(s => s.stepName);
  }, [dynamicForm]);

  const handleFinish = async () => {
    // TODO: pretty error message

    console.log(form);
    if (mode === 'new') {
      try {
        await (isProvider ? createSingleProvider : createSingleGeneric)(name, form)
          .then(async (response) => {
            enqueueSnackbar(name + ' created', {variant: 'success'});
            if (name === 'referral') {
              try {
                await sendPartnerReferral(response.createdId);
                navigate(mainPage);
              } catch (e) {
                console.log(e)
                enqueueSnackbar(`Failed to send ${name}: ` + e.json?.message || e.message, {variant: 'error'});
              }
            } else {
              navigate(mainPage);
            }
          });
      } catch (e) {
        enqueueSnackbar(`Failed to create ${name}: ` + e.json?.message || e.message, {variant: 'error'});
      }

    } else {
      try {
        await (isProvider ? updateSingleProvider : updateSingleGeneric)(name, id, form)
          .then(async () => {
            enqueueSnackbar(name + ' updated', {variant: 'success'});
            if (name === 'referral') {
              try {
                await updatePartnerReferral(id);
                navigate(mainPage);
              } catch (e) {
                console.log(e)
                enqueueSnackbar(`Failed to send ${name}: ` + e.json?.message || e.message, {variant: 'error'});
              }
            } else {
              navigate(mainPage);
            }
          });
      } catch (e) {
        enqueueSnackbar(`Failed to update ${name}: ` + e.json?.message || e.message, {variant: 'error'});
      }
    }

  };

  const handleChange = typeAndId => (e) => {
    form.fields[typeAndId] = e?.target ? e?.target?.value ?? undefined : e;
  };

  const getStepContent = stepIdx => {
    const step = dynamicForm.formStructure[stepIdx].fields;
    setStep(step); 
    return <Box sx={contentStyle}>
      {step.map(({required, id, type, implementation, content, _id}, index) => {
        // Prefer id over _id
        id = id || _id;

        // Check if there is an external rendering logic.
        const Field = onRenderField && onRenderField({required, id, type, implementation, content, serviceOrProgramId},
          index, form.fields, handleChange);
        if (Field != null) return Field;

        if (type === 'question') {
          return <GeneralField key={index} label={content} value={form.fields[`${type}_${id}`]}
                               onChange={handleChange(`${type}_${id}`)}/>;
        } else if (type === 'characteristic' || type === 'internalType') {
          const fieldType = implementation.fieldType.type;
          const {label, optionsFromClass} = implementation;

          let fieldOptions;
          if (optionsFromClass) {
            fieldOptions = dynamicOptions[optionsFromClass] || {};
          } else if (implementation.options) {
            fieldOptions = {};
            implementation.options.forEach(option => fieldOptions[option.iri] = option.label);
          }

          return <FieldGroup component={fieldType} key={`${type}_${id}`} label={label} required={required}
                             options={fieldOptions}
                             value={form.fields[`${type}_${id}`]} onChange={handleChange(`${type}_${id}`)}/>;
        }
      })}
    </Box>;
  };

  if (loading)
    return <Loading message={`Loading...`}/>;

  if (Object.keys(form).length === 0)
    return <Container><Typography variant="h5">No form available</Typography></Container>

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
      />
      <FormStepper
        getStepContent={getStepContent}
        handleFinish={handleFinish}
        stepNames={stepNames}
      />
    </Container>
  );
}
