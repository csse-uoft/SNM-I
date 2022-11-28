import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import {defaultAddEditQuestionFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {Button, Container, Paper, Typography, Divider, IconButton, Grid} from "@mui/material";
import SelectField from '../shared/fields/SelectField.js'
import Dropdown from "../shared/fields/MultiSelectField";
import GeneralField from "../shared/fields/GeneralField";
import RadioField from "../shared/fields/RadioField";
import {
  createCharacteristic, fetchCharacteristic,
  fetchCharacteristicFieldTypes,
  fetchCharacteristicsDataTypes,
  fetchCharacteristicsOptionsFromClass, updateCharacteristic
} from "../../api/characteristicApi";
import LoadingButton from "../shared/LoadingButton";
import {AlertDialog} from "../shared/Dialogs";
import {Add as AddIcon, Delete as DeleteIcon} from "@mui/icons-material";


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


export default function AddEditCharacteristic() {

  const classes = useStyles();
  const navigate = useNavigate();
  const {id, option} = useParams();


  const [state, setState] = useState({
    success: false,
    submitDialog: false,
    loadingButton: false,
    successDialog: false,
    failDialog: false,
    locked: false
  })

  const [errors, setErrors] = useState(
    {}
  )


  const [form, setForm] = useState({
    ...defaultAddEditQuestionFields,
    options: [{key: 0, label: ''}]
  })

  const [types, setTypes] = useState({fieldTypes: {}, dataTypes: {}, optionsFromLabel: {}});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newTypes = {};
    Promise.all([
      fetchCharacteristicFieldTypes().then(fieldTypes => newTypes.fieldTypes = fieldTypes),
      fetchCharacteristicsDataTypes().then(dataTypes => newTypes.dataTypes = dataTypes),
      fetchCharacteristicsOptionsFromClass().then(optionsFromClass => newTypes.optionsFromClass = optionsFromClass)
    ]).then(() => {
      if (option === 'edit' && id) {
        return fetchCharacteristic(id).then(res => {
          const data = res.fetchData
          const locked = res.locked
          if (data.fieldType === 'MultiSelectField' || data.fieldType === 'SingleSelectField' || data.fieldType === 'RadioSelectField') {
            if (data.options) {
              data.classOrManually = 'manually'
              data.optionsFromClass = ''
            } else if (data.optionsFromClass) {
              data.classOrManually = 'class'
              data.options = [{key: 0, label: ''}]
            }
          } else {
            data.classOrManually = 'class'
            data.options = [{key: 0, label: ''}]
            data.optionsFromClass = ''
          }
          setForm(data)
          setState(state => ({...state, locked}))
        })
      }
    }).then(() => {
      setTypes(newTypes);
      setLoading(false);
    }).catch(e => {
      if (e.json)
        setErrors(e.json);
      setLoading(false)
      setState(state => ({...state, failDialog: true}))
    });
  }, [])


  const handleAdd = () => {
    setForm(form => ({...form, options: form.options.concat({label: '', key: Math.random()})}))
  }

  const handleRemove = () => {
    setForm(form => ({...form, options: form.options.splice(0, form.options.length - 1)}))
  }

  const handleSubmit = () => {
    if (validate()) {
      setState(state => ({...state, submitDialog: true}))
    }
  }

  const handleConfirm = async () => {
    setState(state => ({...state, loadingButton: true}))
    const readyForm = {...form, classOrManually: undefined}
    if (!isSelected()) {
      readyForm.options = undefined
      readyForm.optionsFromClass = undefined
    } else if (form.classOrManually === 'class') {
      readyForm.options = undefined
    } else if (form.classOrManually === 'manually') {
      readyForm.optionsFromClass = undefined
    }
    if (form.fieldType === 'MultiSelectField') {
      readyForm.multipleValues = true
    } else {
      readyForm.multipleValues = false
    }
    console.log(readyForm)
    if (option === 'add') {
      createCharacteristic(readyForm).then(res => {
        if (res.success) {
          setState(state => ({...state, loadingButton: false, submitDialog: false, successDialog: true}))
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false, failDialog: true}))
      })
    } else if (option === 'edit') {
      updateCharacteristic(id, readyForm).then(res => {
        if (res.success) {
          setState(state => ({...state, loadingButton: false, submitDialog: false, successDialog: true}))
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false, failDialog: true}))
      })
    }
  }

  const getDataTypeValue = (fieldType) => {
    if (fieldType === 'TextField') {
      return 'xsd:string';
    } else if (fieldType === "NumberField") {
      return 'xsd:number';
    } else if (fieldType === 'BooleanRadioField') {
      return 'xsd:boolean';
    } else if (fieldType === 'DateField' || fieldType === 'DateTimeField' || fieldType === 'TimeField') {
      return 'xsd:datetimes';
    } else {
      return 'owl:NamedIndividual';
    }
  }

  const isSelected = () => {
    return form.fieldType === 'MultiSelectField' || form.fieldType === 'SingleSelectField' || form.fieldType === 'RadioSelectField'
  }

  const validate = () => {
    const errors = {};
    for (const [label, value] of Object.entries(form)) {
      if (label === 'label' || label === 'description' || label === 'fieldType' || label === 'classOrManually' || label === 'name') {
        if (value === '') {
          errors[label] = 'This field cannot be empty'
        }
      } else if (label === 'codes' && value.length === 0) {
        // errors[label] = 'This field cannot be empty'
      } else if (isSelected() && label === 'optionsFromClass' && form.classOrManually === 'class' && value === '') {
        errors[label] = 'This field cannot be empty'
      } else if (isSelected() && label === 'options' && form.classOrManually === 'manually') {
        for (let i = 0; i < form.options.length; i++) {
          if (!form.options[i].label) {
            if (!errors[label]) {
              errors[label] = {}
            }
            errors[label][form.options[i].key] = 'This field cannot be empty, please fill in or remove this field'
          }
        }
      }
    }
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  if (loading)
    return <Loading/>

  return (


    <Container maxWidth='md'>
      <Paper sx={{p: 2}} variant={'outlined'}>
        <Typography variant={'h4'}> Characteristic</Typography>
        <GeneralField
          key={'name'}
          label={'Name'}
          value={form.name}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.name = e.target.value}
          disabled={state.locked}
          error={!!errors.name}
          helperText={errors.name}
        />
        <GeneralField
          key={'description'}
          label={'Description'}
          value={form.description}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.description = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!errors.description}
          helperText={errors.description}
          multiline
          disabled={state.locked}
        />
        <Dropdown
          key={'codes'}
          options={[]}
          label={'Codes'}
          value={form.codes}
          onChange={e => form.codes = e.target.value}
          error={!!errors.codes}
          helperText={errors.codes}
          required
          disabled={state.locked}
        />

        <Divider sx={{pt: 2}}/>
        <Typography sx={{pt: 3}} variant={'h4'}> Implementation</Typography>


        <SelectField
          key={"fieldType"}
          label={'Field Type'}
          options={types.fieldTypes}
          value={form.fieldType}
          controlled
          required
          onChange={e => {
            setForm(form => ({...form, fieldType: e.target.value, dataType: getDataTypeValue(e.target.value)}));
          }}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!errors.fieldType}
          helperText={errors.fieldType}
          disabled={state.locked}
        />

        {isSelected() ?
          <RadioField
            label={'Choosing options from class or input manually'}
            onChange={e => setForm(form => ({...form, classOrManually: e.target.value}))}
            required
            value={form.classOrManually}
            options={{Class: 'class', Manually: 'manually'}}
            disabled={state.locked}
          /> : <div/>}


        <SelectField
          key={"dataType"}
          label={'Data Type'}
          options={types.dataTypes}
          value={form.dataType}
          controlled
          required
          onChange={e => form.dataType = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!errors.dataType}
          helperText={errors.dataType}
          disabled
        />


        <GeneralField
          key={'label'}
          label={'label'}
          value={form.label}
          required
          onChange={e => form.label = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!errors.label}
          helperText={errors.label}
          sx={{mt: '16px', minWidth: 350}}
          disabled={state.locked}
        />


        {isSelected() && form.classOrManually === 'class' ? <SelectField
          key={"optionsFromClass"}
          label={'Options From Class'}
          options={types.optionsFromClass}
          value={form.optionsFromClass}
          required
          onChange={e => form.optionsFromClass = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!errors.optionsFromClass}
          helperText={errors.optionsFromClass}
          disabled={state.locked}
        /> : <div/>}


        {isSelected() && form.classOrManually === 'manually' ? <div>
          {/*<Button variant="contained" color="primary" className={classes.button} onClick={handleAdd}>*/}
          {/*  Add*/}
          {/*</Button>*/}

          {form.options.map((option, index) =>
            <div key={option.key}>
              <Grid display={'flex'}>
                <GeneralField
                  label={'Option Label ' + (index + 1)}
                  value={form.options[index].label}
                  required
                  onChange={e => form.options[index].label = e.target.value}
                  sx={{mt: '16px', minWidth: 350}}
                  error={!!errors.options && !!errors.options[option.key]}
                  helperText={!!errors.options && errors.options[option.key]}
                  disabled={state.locked}
                />
                <IconButton
                  onClick={() => {
                    if (index !== 0 || (index === 0 && form.options.length > 1)) {
                      const temp = [...form.options]
                      temp.splice(index, 1)
                      setForm(form => ({...form, options: [...temp]}))
                    }

                  }}
                  // className={classes.button}
                  size="large" className={classes.button}>
                  <DeleteIcon fontSize="small" color="secondary"/>
                </IconButton>
                {index === form.options.length - 1 ?
                  <IconButton
                    onClick={handleAdd}
                    size="large" className={classes.button}>
                    <AddIcon fontSize="small" color="primary"/>
                  </IconButton> :
                  <span/>}

              </Grid>


            </div>
          )}
        </div> : <div/>}


        {!state.locked ? <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
          submit
        </Button> : <Button variant="contained" color="primary" className={classes.button} onClick={() => {
          navigate('/characteristics')
        }}>
          back
        </Button>}

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={'Are you sure you want to create a new characteristic?'}
                     buttons={[<Button onClick={() => setState(state => ({...state, submitDialog: false}))}
                                       key={'cancel'}>{'cancel'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                      key={'confirm'}
                                      onClick={handleConfirm} children='confirm' autoFocus/>]}
                     open={state.submitDialog && option === 'add'}/>

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={'Are you sure you want to update the characteristic?'}
                     buttons={[<Button onClick={() => setState(state => ({...state, submitDialog: false}))}
                                       key={'cancel'}>{'cancel'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                      key={'confirm'}
                                      onClick={handleConfirm} children='confirm' autoFocus/>]}
                     open={state.submitDialog && option === 'edit'}/>


        <AlertDialog dialogContentText={option === 'add' ? "You have successfully created a new characteristics" :
          'You have successfully update the characteristic'}
                     dialogTitle={'Success'}
                     buttons={[<Button onClick={() => {
                       navigate('/characteristics')
                     }} key={'success'}> {'ok'}</Button>]}
                     open={state.successDialog}/>
        <AlertDialog dialogContentText={errors.message || "Error occurs"}
                     dialogTitle={'Fail'}
                     buttons={[<Button onClick={() => {
                       navigate('/characteristics')
                     }} key={'fail'}>{'ok'}</Button>]}
                     open={state.failDialog}/>
      </Paper>

    </Container>

  )


}