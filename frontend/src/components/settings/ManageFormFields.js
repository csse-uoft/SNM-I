/**
 * For how the drag and drop works, please check the library repository:
 * https://github.com/atlassian/react-beautiful-dnd
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {allForms} from '../../constants/provider_fields.js'
import {Button, Container, Grid, TextField, Typography, Divider, IconButton, Box, Paper} from "@mui/material";
import SelectField from "../shared/fields/SelectField";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {Close as Delete} from "@mui/icons-material";
import {Loading} from "../shared";
import AddFormDialog from "./components/AddFormDialog";
import StepFields from "./components/StepFields";
import {
  createDynamicForm,
  getDynamicForm,
  getDynamicFormsByFormType,
  updateDynamicForm
} from "../../api/dynamicFormApi";
import {fetchCharacteristics} from "../../api/characteristicApi";
import {Picker} from "./components/Pickers";
import {fetchQuestions} from "../../api/questionApi";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";


export default function ManageFormFields() {
  const navigate = useNavigate();

  // Page path: /settings/forms/:formType/:method/:formId
  const {formType, method, formId} = useParams();

  const [loading, setLoading] = useState(true);

  // Characteristic Related
  const [characteristics, setCharacteristics] = useState({});
  const [characteristicOptions, setCharacteristicOptions] = useState({});
  const [selectedCharacteristicId, setSelectedCharacteristicId] = useState('');
  const [usedCharacteristicIds, setUsedCharacteristicIds] = useState([]);

  // Questions Related
  const [questions, setQuestions] = useState({});
  const [questionOptions, setQuestionOptions] = useState({});
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);

  // internalTypes Related
  const [internalTypes, setInternalTypes] = useState({});
  const [internalTypeOptions, setInternalTypeOptions] = useState({});
  const [selectedInternalTypeId, setSelectedInternalTypeId] = useState('');
  const [usedInternalTypeIds, setUsedInternalTypeIds] = useState([]);

  const [state, setState] = useState({
    stepToAdd: undefined,
    selectedStep: null,
  });
  const [errors, setErrors] = useState({});
  // {name: 'form name', formType: 'client', formStructure: [
  //    {stepName: 'step 1', fields: [
  //       {id: 1, type: 'characteristic', required: true, implementation: {...}}
  //    ]},
  //    {...}
  // ]}
  // inferred state

  const [form, setForm] = useState({formType, formStructure: []});
  // console.log('form,', form)

  useEffect(() => {
    Promise.all([
      // Fetch characteristics
      fetchCharacteristics().then(({data}) => {
        const dict = {};
        const options = {};
        for (const characteristic of data) {
          dict[characteristic.id] = characteristic;
          options[characteristic.id] = `${characteristic.name} (${characteristic.implementation.label})`
        }
        setCharacteristics(dict);
        setCharacteristicOptions(options);
      }),

      // Fetch questions
      fetchQuestions().then(({data}) => {
        const dict = {};
        const options = {};
        for (const question of data) {
          dict[question.id] = question;
          options[question.id] = `${question.content} (${question.description || ''})`
        }
        setQuestions(dict);
        setQuestionOptions(options);
      }),

      // fetch internalTypes
      fetchInternalTypeByFormType(formType).then(({internalTypes}) => {
        const dict = {}
        const options = {}
        for (const internalType of internalTypes) {
          dict[internalType._id] = internalType;
          options[internalType._id] = internalType.name;
        }
        setInternalTypes(dict);
        setInternalTypeOptions(options);
      })
    ]).then(() => {
      setLoading(false);
    });

  }, []);

  useEffect(() => {
    form.formType = formType;
  }, [formType]);

  useEffect(() => {
    if (formId) {
      getDynamicForm(formId).then(({form}) => {
        // Calculate used fields
        const usedQuestionsIds = [];
        const usedCharacteristicIds = [];

        for (const step of form.formStructure) {
          for (const field of step.fields) {
            if (field.type === 'characteristic') {
              usedCharacteristicIds.push(field.id);
            } else if (field.type === 'question') {
              usedQuestionsIds.push(field.id)
            }
          }
        }
        setForm(form);
        setUsedQuestionIds(usedQuestionsIds);
        setUsedCharacteristicIds(usedCharacteristicIds);
      });
    }
  }, [formId, formType]);

  const submit = async () => {
    console.log(form);

    if (!form.name) {
      setErrors(errors => ({...errors, formName: 'Form name is required.'}));
      return;
    }

    try {
      if (method === 'new') {
        await createDynamicForm(form);

      } else {
        await updateDynamicForm(formId, form);
      }
      navigate('/settings/manage-forms/' + formType);
    } catch (e) {
      console.error(e)
    }
  };

  const handleChange = useCallback(name => e => {
    const value = e.target.value;
    setState(state => ({...state, [name]: value}));
  }, [state.fields, formType]);

  const handleDeleteField = useCallback((stepIndex, fieldIndex) => {
    setForm(form => {
      const step = form.formStructure[stepIndex];
      const [removed] = step.fields.splice(fieldIndex, 1);

      if (removed.type === 'characteristic') {
        setUsedCharacteristicIds(used => {
          const idx = used.findIndex(chara => chara.id === removed.id);
          used.splice(idx, 1);
          return [...used];
        })
      } else if (removed.type === 'question') {
        setUsedQuestionIds(used => {
          const idx = used.findIndex(question => question.id === removed.id);
          used.splice(idx, 1);
          return [...used];
        })
      }

      return {...form};
    });
  }, []);

  const handleAddCharacteristic = useCallback(() => {
    setForm(form => {
      const formStructure = form.formStructure.find(structure => state.selectedStep === structure.stepName);
      formStructure.fields = [...formStructure.fields, {type: 'characteristic', ...characteristics[selectedCharacteristicId]}]
      return {...form};
    });
    setUsedCharacteristicIds(used => [...used, selectedCharacteristicId])

  }, [selectedCharacteristicId, characteristics, state.selectedStep]);

  const handleAddQuestion = useCallback(() => {
    setForm(form => {
      const formStructure = form.formStructure.find(structure => state.selectedStep === structure.stepName);
      formStructure.fields = [...formStructure.fields, {type: 'question', ...questions[selectedQuestionId]}]
      return {...form};
    });
    setUsedQuestionIds(used => [...used, selectedCharacteristicId])

  }, [selectedQuestionId, questions, state.selectedStep]);

  const handleAddInternalType = useCallback(() => {
    setForm(form => {
      const formStructure = form.formStructure.find(structure => state.selectedStep === structure.stepName);
      formStructure.fields = [...formStructure.fields, {type: 'internalType', ...internalTypes[selectedInternalTypeId]}]
      return {...form};
    });
    setUsedInternalTypeIds(used => [...used, selectedCharacteristicId])

  }, [selectedInternalTypeId, internalTypes, state.selectedStep]);

  const handleAddStep = useCallback(() => {
    const existedStepNames = form.formStructure.map(s => s.stepName);
    if (existedStepNames.includes(state.stepToAdd)) {
      setErrors(errors => ({...errors, newStepName: 'Step name existed'}))
      return;
    }

    // Mutate form and form.formStructure
    setErrors(errors => ({...errors, newStepName: undefined}))
    setForm(form => ({
      ...form,
      formStructure: [
        ...form.formStructure,
        {
          stepName: state.stepToAdd,
          fields: []
        }
      ]
    }));
  }, [state.stepToAdd, form]);

  const handleRemoveStep = useCallback((index, stepName) => () => {
    setForm(form => {
      form.formStructure.splice(index, 1)
      return {...form, formStructure: [...form.formStructure]};
    })
  }, []);

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
    const targetStepIdx = destination.droppableId;
    const sourceStepIdx = source.droppableId;

    // moved to other steps
    if (source.droppableId !== destination.droppableId) {
      const sourceFields = form.formStructure[sourceStepIdx].fields;
      const targetFields = form.formStructure[targetStepIdx].fields;
      const [removed] = sourceFields.splice(source.index, 1);
      targetFields.splice(destination.index, 0, removed);
    }
    // moved within a step
    else {
      reorder(
        form.formStructure[targetStepIdx].fields,
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
            error={!!errors.newStepName}
            helperText={errors.newStepName}
          />
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary" disabled={!state.stepToAdd} onClick={handleAddStep}>
            Add Step
          </Button>
        </Grid>
      </Grid>
    )
  }, [state.stepToAdd, formType, handleChange, handleAddStep, errors]);

  const getNewFieldComponent = useCallback(() => {
    console.log(!selectedInternalTypeId)
    if (!formType) return null;
    return (
      <Grid container alignItems="center" spacing={2}>
        <Grid item sm={3} xs={4}>
          <SelectField
            label="Choose step"
            value={state.selectedStep}
            onChange={handleChange('selectedStep')}
            options={form.formStructure.map(s => s.stepName)}
            noDefaultStyle
            controlled
            fullWidth
          />
        </Grid>
        <Grid item sm={9} xs={10}>
          <Grid container direction={"column"} spacing={1}>
            {Object.keys(characteristics).length > 0 ?
              <Grid item>
                <Picker
                  label={"characteristic"}
                  onChange={setSelectedCharacteristicId}
                  options={characteristicOptions}
                  usedOptionKeys={usedCharacteristicIds}
                  onAdd={handleAddCharacteristic}
                  disabledAdd={!selectedCharacteristicId || !state.selectedStep}
                />
              </Grid> : null}
            {Object.keys(questions).length > 0 ?
              <Grid item>
                <Picker
                  label={"question"}
                  onChange={setSelectedQuestionId}
                  options={questionOptions}
                  usedOptionKeys={usedQuestionIds}
                  onAdd={handleAddQuestion}
                  disabledAdd={!selectedQuestionId || !state.selectedStep}
                />
              </Grid> : null}
            {Object.keys(internalTypes).length > 0 ?
              <Grid item>
                <Picker
                  label={"internal type"}
                  onChange={setSelectedInternalTypeId}
                  options={internalTypeOptions}
                  usedOptionKeys={usedInternalTypeIds}
                  onAdd={handleAddInternalType}
                  disabledAdd={!state.selectedStep || !selectedInternalTypeId}
                />
              </Grid> : null}
          </Grid>
        </Grid>
      </Grid>
    )
  }, [state.fields, formType, handleChange, handleAddCharacteristic, state.selectedField, handleAddInternalType,
    state.selectedStep, characteristicOptions, form.formStructure, usedCharacteristicIds, usedInternalTypeIds,
    internalTypeOptions, questionOptions, usedQuestionIds, selectedCharacteristicId, selectedQuestionId, selectedInternalTypeId]);

  const fieldsComponents = useMemo(() => {
    if (form.formStructure.length === 0) return null;

    return form.formStructure.map((step, index) => {
      const {stepName, fields} = step;
      console.log(fields)
      return (
        <Box key={index} sx={{pt: 1}}>
          <Typography variant="h6" color="textSecondary">
            {stepName}
            <IconButton onClick={handleRemoveStep(index, stepName)} size="large">
              <Delete/>
            </IconButton>
          </Typography>
          <Droppable droppableId={index + ''}>
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <StepFields
                  stepIndex={index}
                  stepFields={fields}
                  handleDeleteField={handleDeleteField}
                  characteristics={characteristics}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Divider/>
        </Box>
      );
    });
  }, [form, handleDeleteField, handleRemoveStep, formType]);

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
            onChange={(e) => navigate(`/settings/forms/${e.target.value}/new`)}
            options={allForms}
            noEmpty
            disabled={!!formId}
          />
        </Grid>
        {method === 'new' ?
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="New form name"
              onChange={e => form.name = e.target.value}
              required
              error={!!errors.formName}
              helperText={errors.formName}
            />
          </Grid>
          :
          <>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Form name"
                value={form.name}
                disabled
                required
              />
            </Grid>
          </>
        }

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
    </Container>
  )
}
