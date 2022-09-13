import React, {useState, useEffect, useMemo} from "react";
import {useParams} from "react-router-dom";
import {getDynamicForm, getDynamicFormsByFormType} from "../../api/dynamicFormApi";
import {Box, Chip, Container, Paper, Typography} from "@mui/material";
import {GoogleMap, Loading} from "../shared";
import {fetchSingleGeneric} from "../../api/genericDataApi";
import SelectField from "../shared/fields/SelectField";
import {fetchCharacteristic} from "../../api/characteristicApi";
import {fetchQuestion} from "../../api/questionApi";
import FieldGroup from "../shared/FieldGroup";

/**
 * This function is the frontend for visualizing single client
 * @returns {JSX.Element}
 */
export default function VisualizeClient() {

  const {option, id} = useParams();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState({});
  const [display, setDisplay] = useState({});
  const [displayAll, setDisplayAll] = useState({});
  const [fieldTypes, setFieldTypes] = useState({});
  const [form, setForm] = useState({});
  const [allForms, setAllForms] = useState({});
  const [selectedFormId, setSelectedFormId] = useState('');
  const [dynamicForm, setDynamicForm] = useState({formStructure: []});

  useEffect(() => {
    Promise.all([
      // get all client forms
      getDynamicFormsByFormType('client').then(({forms}) => {
        const allForms = {};
        forms.forEach(form => allForms[form._id] = form);
        setAllForms(forms);
        // Preselect the first form
        const firstForm = forms[0];
        setForm({formId: firstForm._id, fields: {}});
        setSelectedFormId(firstForm._id);
      }),
    ]).then(async () => {
      if (id) {
        // setForm
        const {data: clientData} = await fetchSingleGeneric('client', id);
        setForm(form => ({...form, fields: clientData}));

        const displayAll = {};
        for (const key in clientData) {
          const [type, id] = key.split('_');
          if (type === 'characteristic') {
            const characteristic = await fetchCharacteristic(id);
            displayAll[characteristic.fetchData.label] = clientData[key];
          } else if (type === 'question') {
            const question = await fetchQuestion(id);
            displayAll[question.fetchData.content] = clientData[key];
          }
        }

        setClient(clientData);
        setDisplayAll(displayAll);

        setLoading(false);
      } else {
        setLoading(false);
      }
    });

  }, [id]);

  useEffect(() => {
    if (selectedFormId) {
      getDynamicForm(selectedFormId).then(({form}) => {
        setDynamicForm(form);

        const fieldTypes = {};
        const display = {};
        for (const step of form.formStructure) {
          for (const field of step.fields) {
            const property = field.type + '_' + field.id;
            fieldTypes[property] = field.implementation.fieldType.type;
            for (const label in displayAll) {
              if (displayAll[label] === client[property]) {
                display[label] = client[property]
              }}}}

        setFieldTypes(fieldTypes);
        setDisplay(display);
      })
    }
  }, [selectedFormId, displayAll]);


  const formOptions = useMemo(() => {
    const options = {};
    Object.values(allForms).forEach(form => options[form._id] = form.name);
    return options
  }, [allForms]);

  if (loading)
    return <Loading message={`Loading user...`}/>;

  if (Object.keys(form).length === 0)
    return <Container><Typography variant="h5">No form available</Typography></Container>


  return (
    <Container>

      <Paper
        sx={{
          paddingLeft: '20px',
          // backgroundColor: 'rgb(198, 223, 215)'
        }}>
        <Typography
          sx={{marginTop: '20px', marginRight: '20px', fontFamily: 'Georgia', fontSize: '150%'}}>
          {'Information for Client with ID: ' + id}
        </Typography>

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
      </Paper>

      <Paper
        sx={{
          padding: '20px',
          // backgroundColor: 'rgb(198, 223, 215)'
        }}>
        {Object.entries(display).map(([content, occurrence]) => {

          let fieldType;
          for (const p in client) {
            if (client[p] === occurrence) {
              fieldType = fieldTypes[p];
            }}


          if (fieldType === 'SingleSelectField') {
            const [prefix, choice] = occurrence.split('#')
            return (
              <Box sx={{padding: '10px'}}>
                <Typography>
                  {content}
                </Typography>
                <Chip label={choice}
                      key={`${content}`}
                />
              </Box>
            )
          } else if (fieldType === 'MultiSelectField') {
            return (
              <Box sx={{padding: '10px'}}>
                <Typography>
                  {content}
                </Typography>
              </Box>
            )
          } else if (fieldType === 'RadioSelectField') {
            const [prefix, choice] = occurrence.split('#')
            console.log(content, occurrence)
            return (
              <Box sx={{padding: '10px'}}>
                <Typography>
                  {content}
                </Typography>
                <Chip label={choice}
                      key={`${content}`}
                />
              </Box>
            )
          } else {
            return (
              <FieldGroup component={fieldType}
                          key={`${content}`}
                          label={content}
                          value={occurrence}
                          disabled
              />
            )
          }
        })}

      </Paper>

      <GoogleMap
        // markers={markers}
      />

    </Container>
  );
}