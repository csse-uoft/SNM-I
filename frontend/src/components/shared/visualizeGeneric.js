import React, {useState, useEffect, useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from 'notistack';

import {getDynamicForm, getDynamicFormsByFormType, getInstancesInClass, getURILabel} from "../../api/dynamicFormApi";
import {
  Box, Button, Chip, Container, Grid, Paper, Typography
} from "@mui/material";
import {Loading} from "./index";
import {fetchSingleGeneric} from "../../api/genericDataApi";
import SelectField from "../shared/fields/SelectField";
import {fetchCharacteristic} from "../../api/characteristicApi";
import {fetchQuestion} from "../../api/questionApi";
import {fetchSingleProvider} from "../../api/providersApi";
import VirtualizeTable from "./virtualizeTable";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {formatLocation} from "../../helpers/location_helpers";


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
export default function VisualizeGeneric({genericType, getAdditionalButtons,}) {

  const navigate = useNavigate();
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState([]);
  const [information, setInformation] = useState([]);
  const [allForms, setAllForms] = useState({}); // a list with all forms
  const [selectedFormId, setSelectedFormId] = useState('all'); // the id of the selected form
  const [genericData, setGenericData] = useState({});
  const [additionalButtons, setAdditionalButtons] = useState(null);
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    (async function () {
      setGenericData(
        (genericType === 'organization' || genericType === 'volunteer')
        ? (await fetchSingleProvider(genericType, id)).data
        : (await fetchSingleGeneric(genericType, id)).data
      );
    })();
  }, [id, genericType]);

  useEffect(() => {
    (async function () {
      // Get internal types
      const {internalTypes: result} = await fetchInternalTypeByFormType(genericType)
      const internalTypes = {}
      for (const {implementation, name, _id} of result) {
        internalTypes[_id] = {implementation, name}
      }

      let streetTypes, streetDirections, states;
      await Promise.all([
        getDynamicFormsByFormType(genericType).then(({forms}) => {
          setAllForms(forms);
        }),
        getInstancesInClass('ic:StreetType').then((data) => streetTypes = data),
        getInstancesInClass('ic:StreetDirection').then((data) => streetDirections = data),
        getInstancesInClass('schema:State').then((data) => states = data),
      ]);
      const addressInfo = {streetTypes, streetDirections, states};

      if (!genericData) return;

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
            {formatLocation(data, addressInfo)}
            </Typography>;
          } else if (['DateField', 'DateTimeField', 'TimeField'].includes(fieldType)) {
            value = <Typography>{new Date(data).toLocaleString()}</Typography>;
          } else if (typeof data === "boolean") {
            value = data ? <Typography>Yes</Typography> : <Typography>No</Typography>;
          } else if (fieldType === 'EligibilityField') {
            if (!data.formula) continue;
            value = data.formula;
          } else {
            value = <Typography>{data}</Typography>;
          }
          information.push({
            label, value, id: key
          })

        } else if (type === 'question') {
          const question = await fetchQuestion(id);
          information.push({
            label: <Typography>{question.question.content}</Typography>,
            value: <Typography>{data}</Typography>,
            id: key
          });
        } else if (type === 'internalType') {
          let value;
          if (Array.isArray(data)) {
            value = [];
            for (const [idx, uri] of data.entries()) {
              const label = await getURILabel(uri);
              value.push(<Chip key={idx} label={label} sx={{mr: 1}}/>)
            }
          } else {
            value = await getURILabel(data)
          }
          information.push({
            label: <Typography>{internalTypes[id].implementation.label}</Typography>,
            value,
            id: key
          })
        }
      }

      setInformation(information);

      setLoading(false);
    })();
  }, [genericData]);

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

  useEffect(() => {
    if (getAdditionalButtons)
      getAdditionalButtons(genericType, genericData, enqueueSnackbar)
        .then(buttons => setAdditionalButtons(buttons));
  }, [genericType, genericData, enqueueSnackbar]);

  const formOptions = useMemo(() => {
    const options = {'all': 'Display All'};
    Object.values(allForms).forEach(form => options[form._id] = form.name);
    return options
  }, [allForms]);

  if (loading)
    return <Loading message={`Loading user...`}/>;

  return (
    <Container>
      <Paper sx={{pl: 2, pr: 2, pb: 2, mb: 2}} elevation={5}>
        <Typography
          sx={{marginTop: '20px', pt: 1, marginRight: '20px', fontSize: '150%'}}>
          {`Information for ${genericType} with ID: ` + id}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item>
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
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => navigate(`edit`)}>Edit</Button>
          </Grid>
            {additionalButtons}
        </Grid>

        <VirtualizeTable rows={display}/>
      </Paper>
    </Container>
  );
}
