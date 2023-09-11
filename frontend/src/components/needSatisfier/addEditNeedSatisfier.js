import React, { useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import {defaultAddEditNeedFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {Chip, Button, Container, Paper, Typography, Divider, IconButton, Grid} from "@mui/material";
import SelectField from '../shared/fields/SelectField.js'
import Dropdown from "../shared/fields/MultiSelectField";
import GeneralField from "../shared/fields/GeneralField";
import RadioField from "../shared/fields/RadioField";
import { fetchCharacteristics,
} from "../../api/characteristicApi";
import LoadingButton from "../shared/LoadingButton";
import {AlertDialog} from "../shared/Dialogs";
import {Add as AddIcon, Delete as DeleteIcon} from "@mui/icons-material";
import {
  createNeedSatisfier, fetchConnectedNeedSatisfiers,
  fetchNeedSatisfier, fetchNeedSatisfiers,
  updateNeedSatisfier
} from "../../api/needSatisfierApi";
import {useSnackbar} from "notistack";
import VisualizeKindOfs from "./VisualizeKindOfs";


const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 0,
    length: 100
  },
}));


export default function AddEditNeedSatisfier() {

  const classes = useStyles();
  const navigate = useNavigate();
  const {id, option} = useParams();

  const {enqueueSnackbar} = useSnackbar();


  const [state, setState] = useState({
    success: false,
    submitDialog: false,
    loadingButton: false,
    locked: false
  })

  const [errors, setErrors] = useState(
    {}
  )

  const [options, setOptions] = useState({});
  const [kindOfOptions, setKindOfOptions] = useState({});


  const [form, setForm] = useState({
    type: '', codes: [], characteristics : [], description: ''
  })

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      // fetchAllCodes todo
      fetchNeedSatisfiers().then(res => {
        const options = {};
        res.needSatisfiers.forEach(({_uri, _id, type, description}) => {
          if (option === 'edit' && id === _id) return; // Skip current need satisfier
          options[_uri] = `${type} (${description})`;
        });
        setKindOfOptions(options);
      }),
      fetchCharacteristics().then(res => {
        const options = {};
        res.data.forEach(characteristic => {
          options[characteristic._uri] = characteristic.name;
        });
        setOptions(options);
      })
    ]).then(() => {
      if (option === 'edit' && id) {
        return fetchNeedSatisfier(id).then(res => {
          const needSatisfier = res.needSatisfier;
          needSatisfier.characteristics = needSatisfier.characteristics.map(characteristic => {
            return characteristic._uri;
          });
          setForm(needSatisfier);
        })
      }
    }).then(() => {
      setLoading(false);
    }).catch(e => {
      setLoading(false);
      enqueueSnackbar(`Fail: ` + e.message, {variant: 'error'});
    });
  }, [])

  const handleSubmit = () => {
    console.log(form)
    if (validate()) {
      setState(state => ({...state, submitDialog: true}))
    }
  }

  const handleConfirm = async () => {
    setState(state => ({...state, loadingButton: true}))
    if (option === 'add') {
      createNeedSatisfier(form).then(res => {
        if (res.success) {
          setState(state => ({...state, loadingButton: false, submitDialog: false}))
          navigate('/needSatisfiers');
          enqueueSnackbar(`Success: The Need Satisfier is created`, {variant: 'success'});
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false,}))
        enqueueSnackbar(`Fail: ` + e.message, {variant: 'error'});
      })
    } else if (option === 'edit') {
      updateNeedSatisfier(id, form).then(res => {
        if (res.success) {
          setState(state => ({...state, loadingButton: false, submitDialog: false,}))
          navigate('/needSatisfiers')
          enqueueSnackbar(`Successfully update needSatisfier_${id}`, {variant: 'success'})
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false,}))
        enqueueSnackbar(`Fail: ` + e.message, {variant: 'error'});
      })
    }
  }


  const validate = () => {
    const errors = {};
    for (const [label, value] of Object.entries(form)) {
      if (label === 'type' || label === 'description') {
        if (!value) {
          errors[label] = 'This field cannot be empty'
        }
      } else if (label === 'codes' && value.length === 0) {
        // errors[label] = 'This field cannot be empty'
      } else if(label === 'characteristics') {
        if(!Array.isArray(value))
          errors[label] = 'Wrong format'
        else if(value.length === 0)
          errors[label] = 'This format cannot be empty'
      }
    }
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleOnblur = (field) => {
    if(field === 'type' || field === 'description'){
      if(!form[field])
        setErrors({...errors, [field]: 'This field cannot be empty'})
      else
        setErrors({...errors, [field]: null})
    }else if(field === 'characteristics'){
      if(!Array.isArray(form[field]))
        setErrors({...errors, [field]: 'Wrong format'})
      else if(form[field].length === 0)
        setErrors({...errors, [field]: 'This field cannot be empty'})
      else
        setErrors({...errors, [field]: null})
    }else if(field === 'codes'){
      // todo
    }
  }

  const keyPress = e => {
    if(e.key === 'Enter')
      handleSubmit();
  }

  if (loading)
    return <Loading/>

  return (


    <Container maxWidth='md' onKeyPress={keyPress}>
      <Paper sx={{p: 2}} variant={'outlined'}>
        <Typography variant={'h4'}> Need Satisfier </Typography>
        <GeneralField
          label={'Type'}
          value={form.type}
          required
          onBlur = {() => handleOnblur('type')}
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.type = e.target.value}
          error={!!errors.type}
          helperText={errors.type}
        />

        <GeneralField
          label={'Description'}
          value={form.description}
          required
          multiline
          onBlur = {() => handleOnblur('description')}
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.description = e.target.value}
          error={!!errors.description}
          helperText={errors.description}
        />

        <Dropdown
          options={options}
          label={'Characteristics'}
          onBlur = {() => handleOnblur('characteristics')}
          value={form.characteristics}
          onChange={e => form.characteristics = e.target.value}
          error={!!errors.characteristics}
          helperText={errors.characteristics}
        />

        <Dropdown
          options={kindOfOptions}
          label={'Kind Of'}
          value={form.kindOf}
          onChange={e => form.kindOf = e.target.value}
          error={!!errors.kindOf}
          helperText={errors.kindOf}
        />

        <Dropdown
          options={[]}
          label={'Codes'}
          value={form.codes}
          onChange={e => form.codes = e.target.value}
          error={!!errors.codes}
          helperText={errors.codes}
        />

        <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
          submit
        </Button>

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={'Are you sure you want to create a new need satisfier?'}
                     buttons={[<Button onClick={() => setState(state => ({...state, submitDialog: false}))}
                                       key={'cancel'}>{'cancel'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                      key={'confirm'}
                                      onClick={handleConfirm} children='confirm' autoFocus/>]}
                     open={state.submitDialog && option === 'add'}/>

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={'Are you sure you want to update the need satisfier?'}
                     buttons={[<Button onClick={() => setState(state => ({...state, submitDialog: false}))}
                                       key={'cancel'}>{'cancel'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                      key={'confirm'}
                                      onClick={handleConfirm} children='confirm' autoFocus/>]}
                     open={state.submitDialog && option === 'edit'}/>
      </Paper>

      <VisualizeKindOfs
        id={id}
        fetchAPI={async () => await fetchConnectedNeedSatisfiers(`:needSatisfier_${id}`)}
      />

    </Container>

  )


}