/**
 * For how the drag and drop works, please check the library repository:
 * https://github.com/atlassian/react-beautiful-dnd
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { providerFields, allForms, providerFormTypes } from '../../constants/provider_fields.js'
import { clientFields } from "../../constants/client_fields";
import { fetchQuestions } from '../../api/mockedApi/question';
import RadioField from '../shared/fields/RadioField';
import { Button, Container, Grid, TextField, Typography, Divider, IconButton, Box, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SelectField from "../shared/fields/SelectField";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Close as Delete } from "@mui/icons-material";
import { fetchProviderFields, updateProviderFields } from "../../api/mockedApi/providerFields";

import { fetchClientFields, updateClientFields } from '../../api/mockedApi/clientFields';
import { Loading } from "../shared";
import AddFormDialog from "./components/AddFormDialog";


const radioButtonOptions = {'Mandatory': true, 'Not mandatory': false};

function StepFields({stepFields, fields, stepName, handleRadioChange, handleDeleteField}) {
  return stepFields.map(({field, required, type}, index) => {
    return (
      <Draggable key={field} draggableId={field} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              backgroundColor: snapshot.isDragging ? '#bbb' : null,
              ...provided.draggableProps.style
            }}>
            <RadioField
              required noStar row
              key={field}
              label={(fields[field] && fields[field]['label']) || field}
              onChange={handleRadioChange(field, stepName)}
              options={radioButtonOptions}
              value={required}
            />
            <IconButton
              onClick={() => !snapshot.isDragging && handleDeleteField(index, stepName)}
              size="large">
              <Delete/>
            </IconButton>
          </div>
        )}
      </Draggable>
    );
  });
}

export default function ManageFormFields() {
  const history = useHistory();

  // Page path: /settings/forms/:formType/:method/:formId
  const {formType, method, formId} = useParams();
  console.log(formType, method, formId)


  const [loading, setLoading] = useState(true);

  const [availableForms, setAvailableForms] = useState([])

  const [openAddFormDialog, setOpenAddFormDialog] = useState(false);
  const [state, setState] = useState({
    formToAdd: '',
    selectedForm: '',
    stepToAdd: '',
    selectedStep: '',
    selectedField: '',
    questions: {},
    /**
     * @type {{organization: {form_structure: {}, steps_order: []}, }}
     */
    fields: {}
  });

  useEffect(() => {

    const tasks = [];
    tasks.push(fetchQuestions().then(questions => setState(state => ({...state, questions}))));
    // fetch provider fields
    tasks.push(fetchProviderFields(false).then(fields => {
      for (const category of Object.keys(fields)) {
        const formStructure = fields[category].form_structure;
        const stepsOrder = fields[category].steps_order;
        for (const stepName of stepsOrder) {
          const stepsList = [];
          const steps = formStructure[stepName];
          for (const [field, value] of Object.entries(steps)) {
            stepsList.push({field, ...value});
          }
          fields[category].form_structure[stepName] = stepsList;
        }
      }
      // server may not respond full list of provider options, add it manually
      for (const providerCategory of Object.keys(providerFormTypes)) {
        if (!fields[providerCategory])
          fields[providerCategory] = {form_structure: [], steps_order: []};
      }

      setState(state => ({...state, fields: {...state.fields, ...fields}}));
    }));

    // fetch clients fields
    tasks.push(fetchClientFields().then(clientFields => {
      const formStructure = clientFields.form_structure;
      for (const stepName of Object.keys(formStructure)) {
        const stepsList = [];
        for (const [field, required] of Object.entries(formStructure[stepName])) {
          stepsList.push({field, type: 'field', required});
        }
        formStructure[stepName] = stepsList;
      }
      setState(state => ({...state, fields: {...state.fields, client: clientFields}}));
    }))
    Promise.all(tasks).then(() => {
      console.log('done')
      setLoading(false);
    });

  }, []);

  const submit = async () => {
    let form = {};
    let submitFunction;
    if (formType === 'client') {
      submitFunction = updateClientFields;
      form = {
        steps_order: state.fields.client.steps_order,
        form_structure: {},
      };
      const formStructure = state.fields.client.form_structure;
      for (const stepName of Object.keys(formStructure)) {
        const newFormStructure = form.form_structure[stepName] = {};
        for (const {field, required} of formStructure[stepName]) {
          newFormStructure[field] = required
        }
      }
    }
    // providers
    else {
      submitFunction = updateProviderFields;
      for (const category of Object.keys(state.fields)) {
        form[category] = {
          steps_order: state.fields[category].steps_order,
          form_structure: {},
        };
        const formStructure = state.fields[category].form_structure;
        for (const stepName of Object.keys(formStructure)) {
          const newFormStructure = form[category].form_structure[stepName] = {};
          for (const {field, required} of formStructure[stepName]) {
            newFormStructure[field] = {type: 'field', required};
          }
        }
      }
      delete form.client;
    }
    console.log(form);
    try {
      await submitFunction(form);
      history.push('/dashboard');
    } catch (e) {
      // TODO: show error message
      console.error(e)
    }
  };

  const initialOptions = useMemo(() => {
    let fieldOptions = {};
    const fields = formType === 'client' ? clientFields : providerFields;
    for (const [field, {label}] of Object.entries(fields)) {
      fieldOptions[field] = label;
    }
    return fieldOptions;
  }, [formType]);

  // this may not be efficient, but it is easier to implement...
  const getAvailableOptions = useCallback(() => {
    if (!formType) return {};
    const options = {...initialOptions};
    for (const steps of Object.values(state.fields[formType].form_structure)) {
      for (const {field} of steps) {
        if (Object.keys(options).includes(field))
          delete options[field];
      }
    }
    return options;
  }, [state.fields, formType, initialOptions]);

  const handleChange = useCallback(name => e => {
    const value = e.target.value;
    if (name === 'category') {
      if (state.fields[value]) {
        setState(state => ({
          ...state, [name]: value, selectedField: '', selectedStep: '', stepToAdd: ''
        }));
      }
    } else
      setState(state => ({...state, [name]: value}));
  }, [state.fields]);

  const handleRadioChange = useCallback((field, stepName) => e => {
    const fields = state.fields[formType].form_structure[stepName];
    for (const curr_field of fields) {
      if (curr_field.field === field)
        curr_field.required = e.target.value;
    }
  }, [state.fields, formType]);

  const handleDeleteField = useCallback((index, stepName) => {
    const fields = [...state.fields[formType].form_structure[stepName]];
    fields.splice(index, 1);
    state.fields[formType].form_structure[stepName] = fields;
    setState(state => ({...state, fields: {...state.fields}}));
  }, [state.fields, formType]);

  const handleAddField = useCallback(() => {
    const formStructure = state.fields[formType].form_structure;
    for (const steps of Object.values(formStructure)) {
      for (const {field} of steps) {
        if (field === state.selectedField)
          return;
      }
    }
    state.fields[formType].form_structure[state.selectedStep].push({
      field: state.selectedField,
      type: 'field', // TODO: implement questions
      required: false,
    });
    setState(state => ({...state, selectedField: '', fields: {...state.fields}}))
  }, [state.fields, formType, state.selectedStep, state.selectedField]);

  const handleRemoveStep = useCallback((index, stepName) => () => {
    state.fields[formType].steps_order.splice(index, 1);
    delete state.fields[formType].form_structure[stepName];
    setState(state => ({...state, fields: {...state.fields}}))
  }, [state.fields, formType]);

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);
  };

  // invoked when something is dropped
  const onDragEnd = ({source, destination}) => {

    // dropped outside the list
    if (!destination) {
      return;
    }
    const targetStepName = destination.droppableId;
    const sourceStepName = source.droppableId;

    // moved to other steps
    if (source.droppableId !== destination.droppableId) {
      const sourceSteps = state.fields[formType].form_structure[sourceStepName];
      const targetSteps = state.fields[formType].form_structure[targetStepName];
      const [removed] = sourceSteps.splice(source.index, 1);
      targetSteps.splice(destination.index, 0, removed);
    }
    // moved within a step
    else {
      reorder(
        state.fields[formType].form_structure[targetStepName],
        source.index,
        destination.index
      );
    }
  };

  const newStepComponent = useMemo(() => {
    if (!formType) return null;
    return (
      <Grid container alignItems="flex-end" spacing={2} sx={{pb: 1, pt: 1}}>
        <Grid item>
          <TextField
            label="New step name"
            value={state.stepToAdd}
            onChange={handleChange('stepToAdd')}
          />
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary" disabled={!state.stepToAdd} onClick={() => {
            setState(state => {
              state.fields[formType].form_structure[state.stepToAdd] = [];
              state.fields[formType].steps_order.push(state.stepToAdd);
              return ({...state, fields: {...state.fields}});
            });
          }}>
            Add Step
          </Button>
        </Grid>
      </Grid>
    )
  }, [state.stepToAdd, formType, handleChange]);

  const getNewFieldComponent = useCallback(() => {
    if (!formType) return null;
    return (
      <Grid container alignItems="flex-end" spacing={2}>
        <Grid item sm={3} xs={4}>
          <SelectField
            label="Choose step"
            value={state.selectedStep}
            onChange={handleChange('selectedStep')}
            options={state.fields[formType].steps_order}
            noDefaultStyle
            formControlProps={{fullWidth: true}}
            noEmpty
            controlled
          />
        </Grid>
        <Grid item sm={7} xs={8}>
          <SelectField
            label="Choose field"
            value={state.selectedField}
            onChange={handleChange('selectedField')}
            options={getAvailableOptions()}
            noDefaultStyle
            formControlProps={{fullWidth: true}}
            noEmpty
            controlled
          />
        </Grid>
        <Grid item sm={2}>
          <Button variant="outlined" color="primary" onClick={handleAddField}
                  disabled={!state.selectedField || !state.selectedStep}>
            Add Field
          </Button>
        </Grid>
      </Grid>
    )
  }, [state.fields, formType, handleChange, handleAddField, state.selectedField,
    state.selectedStep, getAvailableOptions]);

  const fieldsComponents = useMemo(() => {
    if (!state.fields[formType]) return null;
    const formStructure = state.fields[formType].form_structure;
    return Object.keys(formStructure).map((stepName, index) => {
      return (
        <Box key={index} sx={{pt: 1}}>
          <Typography variant="h6" color="textSecondary">
            {stepName}
            <IconButton onClick={handleRemoveStep(index, stepName)} size="large">
              <Delete/>
            </IconButton>
          </Typography>
          <Droppable droppableId={stepName}>
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <StepFields
                  stepName={stepName}
                  stepFields={formStructure[stepName]}
                  handleRadioChange={handleRadioChange}
                  handleDeleteField={handleDeleteField}
                  fields={formType === 'client' ? clientFields : providerFields}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Divider/>
        </Box>
      );
    });
  }, [state.fields, formType, handleRadioChange, handleDeleteField, handleRemoveStep]);

  if (loading)
    return <Loading/>

  return (
    <Container>
      <Typography variant="h5">
        Manage Fields
      </Typography>

      <Grid container alignItems="flex-end" spacing={2} sx={{pb: 1, pt: 1}}>
        <Grid item>
          <SelectField
            label="Form type"
            value={formType}
            onChange={(e) => history.push(`/settings/forms/${e.target.value}/new`)}
            options={allForms}
            noEmpty
          />
        </Grid>
        <Grid item>
          <SelectField
            label="Choose form"
            value={state.selectedForm}
            onChange={handleChange('selectedForm')}
            options={availableForms}
            noEmpty
          />
        </Grid>

        <Grid item>
          <Button variant="outlined" color="primary"
                  onClick={() => setOpenAddFormDialog(true)}>
            Add form
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{pt: 1, mb: 1}}/>
      {newStepComponent}
      {getNewFieldComponent()}
      <Paper variant="outlined" sx={{mt: 2, p: 1, pl: 2}}>
        <DragDropContext onDragEnd={onDragEnd}>
          {fieldsComponents}
        </DragDropContext>
      </Paper>

      {formType &&
        <Button variant="outlined" color="primary" onClick={submit} sx={{mt: 2}}>
          Submit
        </Button>}

      <AddFormDialog
        open={openAddFormDialog}
        handleAdd={(name) => {
          setAvailableForms(forms => [...forms, name]);
          setState(state => ({...state, selectedForm: name}));
          setOpenAddFormDialog(false);
        }}
        handleClose={() => setOpenAddFormDialog(false)}
      />
    </Container>
  )
}
