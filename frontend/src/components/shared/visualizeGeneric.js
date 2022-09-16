import React, {useState, useEffect, useMemo} from "react";
import {useParams} from "react-router-dom";
import {getDynamicForm, getDynamicFormsByFormType, getInstancesInClass} from "../../api/dynamicFormApi";
import {Box, Chip, Container, Paper, Typography} from "@mui/material";
import {GoogleMap, Loading} from "../shared";
import {fetchSingleGeneric} from "../../api/genericDataApi";
import SelectField from "../shared/fields/SelectField";
import {fetchCharacteristic} from "../../api/characteristicApi";
import {fetchQuestion} from "../../api/questionApi";
import FieldGroup from "../shared/FieldGroup";
import {fetchSingleProvider} from "../../api/providersApi";

/**
 * This function is the frontend for visualizing single generic
 * @returns {JSX.Element}
 */
export default function VisualizeGeneric({genericType, }) {

  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [generic, setGeneric] = useState({});
  const [display, setDisplay] = useState({});
  const [displayAll, setDisplayAll] = useState({});
  const [fieldTypes, setFieldTypes] = useState({});
  const [form, setForm] = useState({});
  const [allForms, setAllForms] = useState({}); // a list with all forms
  const [selectedFormId, setSelectedFormId] = useState(''); // the id of the selected form
  const [dynamicForm, setDynamicForm] = useState({formStructure: []});
  const [streetTypes, setStreetTypes] = useState({})
  const [streetDirections, setStreetDirection] = useState({})
  const [states, setStates] = useState({})

  useEffect(() => {
    Promise.all([
      getDynamicFormsByFormType(genericType).then(({forms}) => {
        setAllForms(forms);
        // Preselect the first form
        const firstForm = forms[0];
        setForm({formId: firstForm._id, fields: {}}); // ?
        setSelectedFormId(firstForm._id);
      }),
      getInstancesInClass('ic:StreetType').then((streetTypes)=>setStreetTypes(streetTypes)),
      getInstancesInClass('ic:StreetDirection').then((streetDirections)=>setStreetDirection(streetDirections)),
      getInstancesInClass('schema:State').then((states)=>setStates(states)),
    ]).then(async () => {
      if (id) {
        // setForm
        const {data: genericData} = (genericType === 'organization'||genericType === 'volunteer') ? await fetchSingleProvider(genericType, id):
          await fetchSingleGeneric(genericType, id);
        setForm(form => ({...form, fields: genericData}));

        const displayAll = {};
        for (const key in genericData) {
          const [type, id] = key.split('_');
          if (type === 'characteristic') {
            const characteristic = await fetchCharacteristic(id);
            displayAll[characteristic.fetchData.label] = genericData[key];
          } else if (type === 'question') {
            const question = await fetchQuestion(id);
            displayAll[question.question.content] = genericData[key];
          }
        }

        setGeneric(genericData);
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
            fieldTypes[property] = field.implementation? field.implementation.fieldType.type: 'TextField';
            for (const label in displayAll) {
              console.log(label)
              if (displayAll[label] === generic[property]) {
                display[label] = generic[property]
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
          {`Information for ${genericType} with ID: ` + id}
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
          for (const p in generic) {
            if (generic[p] === occurrence) {
              fieldType = fieldTypes[p];
            }}


          if (fieldType === 'SingleSelectField') {
            const [prefix, choice] = occurrence.split('#')
            return (
              <Box sx={{padding: '10px'}}>
                {/*<Typography>*/}
                {/*  {content}*/}
                {/*</Typography>*/}
                {/*<Chip label={choice}*/}
                {/*      key={`${content}`}*/}
                {/*/>*/}
                <Typography>
                  {`${content}: ${choice}`}
                </Typography>
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
                {`${content}: ${choice}`}
              </Typography>
              </Box>
              // <Box sx={{padding: '10px'}}>
              //   <Typography>
              //     {content}
              //   </Typography>
              //   <Chip label={choice}
              //         key={`${content}`}
              //   />
              // </Box>
            )
          } else if(fieldType === 'AddressField'){
            return (
              <Box sx={{padding: '10px'}}>
                <Typography>
                  {`${content}: ${occurrence.unitNumber?occurrence.unitNumber + '-':''}${occurrence.streetNumber?occurrence.streetNumber:''} ${occurrence.streetName} ${occurrence.streetType?streetTypes[occurrence.streetType]:''}
            ${occurrence.streetDirection?streetDirections[occurrence.streetDirection]:''}, ${occurrence.city}, ${states[occurrence.state]}, ${occurrence.postalCode}`}
                </Typography>
              </Box>)
          }else if(fieldType === 'DateTimeField' || fieldType === "DateField"){
            return (
              <Box sx={{padding: '10px'}}>
              <Typography>
                {`${content}: ${Date(occurrence)}`}
              </Typography>
              </Box>
            )
          }
          else {
            console.log(fieldType)
            // console.log(occurrence)
            return (
              // <FieldGroup component={fieldType}
              //             key={`${content}`}
              //             label={content}
              //             value={occurrence}
              //             disabled
              // />
              <Box sx={{padding: '10px'}}>
              <Typography>
                {`${content}: ${occurrence}`}
              </Typography>
              </Box>
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