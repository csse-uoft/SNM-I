import React, {useState, useEffect, useMemo} from "react";
import {useParams} from "react-router-dom";
import {getDynamicForm, getDynamicFormsByFormType, getInstancesInClass, getURILabel} from "../../api/dynamicFormApi";
import {
  Box, Chip, Container, Paper, Typography
} from "@mui/material";
import {Loading} from "./index";
import {fetchSingleGeneric} from "../../api/genericDataApi";
import SelectField from "../shared/fields/SelectField";
import {fetchCharacteristic} from "../../api/characteristicApi";
import {fetchQuestion} from "../../api/questionApi";
import {fetchSingleProvider} from "../../api/providersApi";
import VirtualizeTable from "./virtualizeTable";


async function getOptionLabels(uris, options) {
  const labels = [];

  const isOption = uris[0].startsWith('http://snmi#option');
  if (isOption) {
    const ids = uris.map(uri => uri.split('_').slice(-1)[0]);
    for (const option of options) {
      if (ids.includes(option._id)) {
        labels.push(option.label);
      }
    }
  } else {
    labels.push(...await Promise.all(uris.map(uri => getURILabel(uri))));
  }

  return labels;
}

/**
 * This function is the frontend for visualizing single generic
 * @returns {JSX.Element}
 */
export default function VisualizeGeneric({genericType,}) {

  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState([]);
  const [information, setInformation] = useState([]);
  const [allForms, setAllForms] = useState({}); // a list with all forms
  const [selectedFormId, setSelectedFormId] = useState('all'); // the id of the selected form

  useEffect(() => {
    (async function () {
      let streetTypes, streetDirections, states;
      await Promise.all([
        getDynamicFormsByFormType(genericType).then(({forms}) => {
          setAllForms(forms);
        }),
        getInstancesInClass('ic:StreetType').then((data) => streetTypes = data),
        getInstancesInClass('ic:StreetDirection').then((data) => streetDirections = data),
        getInstancesInClass('schema:State').then((data) => states = data),
      ]);

      const {data: genericData} = (genericType === 'organization' || genericType === 'volunteer')
        ? await fetchSingleProvider(genericType, id)
        : await fetchSingleGeneric(genericType, id);

      const information = [];
      for (let [key, data] of Object.entries(genericData)) {
        const [type, id] = key.split('_');
        if (type === 'characteristic') {
          const characteristic = await fetchCharacteristic(id);
          const fieldType = characteristic.fetchData.fieldType;
          const isOption = typeof data === "string" && data.startsWith('http://snmi#option');

          const label = <Typography>{characteristic.fetchData.label}</Typography>;
          let value;

          if (typeof data === "string" && data.includes('://') && !isOption) {
            data = await getURILabel(data);
            if (characteristic.fetchData.name === 'Gender') {
              data = data.substring(data.lastIndexOf(':') + 1);
            }
          } else if (isOption) {
            const id = data.match(/_(\d+)/)[1];
            data = characteristic.fetchData.options.find(option => option._id === id).label;
          }

          if (fieldType === 'MultiSelectField') {
            value = (await getOptionLabels(data, characteristic.fetchData.options)).map((label, idx) => {
              return <Chip key={idx + label} label={label} sx={{mr: 1}}/>
            });
          } else if (fieldType === 'AddressField') {
            value = <Typography>
              {`${data.unitNumber ? data.unitNumber + '-' : ''}${data.streetNumber ? data.streetNumber : ''} ${data.streetName} ${data.streetType ? streetTypes[data.streetType] : ''}
                ${data.streetDirection ? streetDirections[data.streetDirection] : ''}, ${data.city}, ${states[data.state]}, ${data.postalCode}`}
            </Typography>;
          } else if (['DateField', 'DateTimeField', 'TimeField'].includes(fieldType)) {
            value = <Typography>{new Date(data).toLocaleString()}</Typography>;
          } else if (typeof data === "boolean") {
            value = data ? <Typography>Yes</Typography> : <Typography>No</Typography>;
          } else {
            value = <Typography>{data}</Typography>;
          }
          information.push({
            label, value, id: key
          })

        } else if (type === 'question') {
          const question = await fetchQuestion(id);
          information.push({
            label: question.question.content, value, id: key
          });
        }
      }

      setInformation(information);

      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (selectedFormId === 'all') {
      // Display all
      setDisplay(information);
    } else if (selectedFormId) {
      getDynamicForm(selectedFormId).then(({form}) => {
        const display = [];
        for (const step of form.formStructure) {
          for (const field of step.fields) {
            const property = field.type + '_' + field.id;
            for (const {label, value, id} of information) {
              if (id === property) {
                display.push({label, value, id});
              }
            }
          }
        }
        setDisplay(display);
      })
    }

  }, [selectedFormId, information]);


  const formOptions = useMemo(() => {
    const options = {'all': 'Display All'};
    Object.values(allForms).forEach(form => options[form._id] = form.name);
    return options
  }, [allForms]);

  if (loading)
    return <Loading message={`Loading user...`}/>;

  return (
    <Container>
      <Paper sx={{pl: 2, pr: 2, pb: 2, mb: 2}}>
        <Typography
          sx={{marginTop: '20px', pt: 1, marginRight: '20px', fontSize: '150%'}}>
          {`Information for ${genericType} with ID: ` + id}
        </Typography>

        <SelectField
          label="Select a form"
          value={selectedFormId}
          controlled
          onChange={e => {
            setSelectedFormId(e.target.value);
          }}
          options={formOptions}
          sx={{mb: 2}}
        />
        <VirtualizeTable rows={display}/>
      </Paper>
    </Container>
  );
}