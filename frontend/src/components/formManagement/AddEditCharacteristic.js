import React, {useCallback,useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {fetchUsers} from "../../api/userApi";
import {defaultAddEditQuestionFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {Box, Button, Container, Paper, TextField, Typography, Divider} from "@mui/material";
import SelectField from '../shared/fields/SelectField.js'
import AddableTextField from "../shared/fields/AddableTextField";
import {userFirstEntryFields} from "../../constants/userFirstEntryFields";
import {AlertDialog} from "../shared/Dialogs";
import LoadingButton from "../shared/LoadingButton";
import {addEditQuestionFields} from "../../constants/addEditQuestionFields";
import Dropdown from "../shared/fields/MultiSelectField";
import GeneralField from "../shared/fields/GeneralField";
import RadioField from "../shared/fields/RadioField";
import {
  fetchCharacteristicFieldTypes,
  fetchCharacteristicsDataTypes,
  fetchCharacteristicsOptionsFromClass
} from "../../api/characteristicApi";
import {userInvitationFields} from "../../constants/userInvitationFields";
import {isFieldEmpty} from "../../helpers";
import {REQUIRED_HELPER_TEXT} from "../../constants";




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
  const history = useHistory();
  const {id, option} = useParams();

  const [errors, setErrors] = useState(
    {}
  )


  const [form, setForm] = useState({
    ...defaultAddEditQuestionFields
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
      setTypes(newTypes);
      setLoading(false);
    });
  }, [])


  const handleAdd = () => {
    setForm(form => ({...form, options: form.options.concat({label: '', key: Math.random()})}))
  }

  const handleRemove = () => {
    setForm(form => ({...form, options: form.options.splice(0, form.options.length - 1)}))
  }

  const displayDataTypeValue = () => {
    if(form.fieldType === 'TextField'){
      return 'xsd:string'
    }else if(form.fieldType === "NumberField"){
      return 'xsd:number'
    }else if(form.fieldType === 'BooleanRadioField'){
      return 'xsd:boolean'
    }else if(form.fieldType === 'DateField' || form.fieldType === 'DateTimeField' || form.fieldType === 'TimeField'){
      return 'xsd:datetimes'
    }else if(isSelected()){
      if(form.classOrManually === 'class'){
        return 'owl:NamedIndividual'
      }else{
        return 'xsd:string'
      }
    }else if(form.fieldType === 'PhoneNumberField' || form.fieldType === 'AddressField'){
      return 'owl:NamedIndividual'
    }
  }

  const isSelected = () => {
    return form.fieldType === 'MultiSelectField' || form.fieldType === 'SingleSelectField' || form.fieldType === 'RadioSelectField'
  }

  const validate = () => {
    const errors = {};
    for (const [label, value] of Object.entries(form)){
      if(label === 'label' || label === 'description' || label === 'fieldType'|| label === 'classOrManually' || label === 'name'){
        if(value === ''){
          errors[label] = 'This field cannot be empty'
        }
      }else if(label === 'codes' && value.length === 0){
        errors[label] = 'This field cannot be empty'
      }else if(isSelected() && label === 'optionsFromClass' && form.classOrManually === 'class' && value === ''){
        errors[label] = 'This field cannot be empty'
      }else if(isSelected() && label === 'options' && form.classOrManually === 'manually'){
        for (let i = 0; i < form.options.length; i++){
          if(!form.options[i].label){
            if(!errors[label]){
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

  // useEffect(() => {
  //   fetchUsers().then(data => {
  //     if(option === 'edit'){
  //       setState(state => ({...state, loading: false, form: data.form}));
  //     }else{
  //       setState(state => ({...state, loading: false}))
  //     }
  //   }); //Todo add error handler here
  // }, []);
  //
  //
  // if(state.loading){
  //   return <Loading message={'Loading'}/>
  // }
  if (loading)
    return <Loading/>

  return (


    <Container maxWidth='md'>
      <Paper sx={{p: 2}} variant={'outlined'}>
        <Typography variant={'h4'}> Characteristic</Typography>
        <GeneralField
          label={'Name'}
          value={form.name}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.name = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
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
        />

        <Divider sx={{pt: 2}}/>
        <Typography sx={{pt: 3}} variant={'h4'}> Implementation</Typography>



        <SelectField
          key={"fieldType"}
          label={'Field Type'}
          InputLabelProps={{id:'FieldType', }}
          options={types.fieldTypes}
          value={form.fieldType}
          noEmpty={true}
          required
          onChange={e => setForm(form => ({...form, fieldType: e.target.value}))}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!errors.fieldType}
          helperText={errors.fieldType}
        />

        {isSelected()?
          <RadioField
          label={'Choosing options from class or input manually'}
          onChange={e => setForm(form => ({...form, classOrManually: e.target.value}))}
          required
          value={form.classOrManually}
          options={{Class: 'class', Manually: 'manually'}}
        />:<div/>}


        <SelectField
          key={"dataType"}
          label={'Data Type'}
          InputLabelProps={{id: 'dataType',}}
          options={types.dataTypes}
          value={displayDataTypeValue()}
          // noEmpty={true}
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
        />




        {isSelected() && form.classOrManually === 'class' ? <SelectField
          key={"optionsFromClass"}
          label={'Options From Class'}
          InputLabelProps={{id:'optionsFromClass', }}
          options={types.optionsFromClass}
          value={form.optionsFromClass}
          noEmpty={true}
          required
          onChange={e => form.optionsFromClass = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!errors.optionsFromClass}
          helperText={errors.optionsFromClass}
        /> : <div/>}

        {/*<Dropdown*/}
        {/*  options={}*/}
        {/*  label={'Options From Class'}*/}
        {/*  value={state.form.optionsFromClass}*/}
        {/*  onChange={e => state.form.optionsFromClass = e.target.value}*/}
        {/*  error={!!state.errors.optionsFromClass}*/}
        {/*  helperText={state.errors.optionsFromClass}*/}
        {/*  required*/}
        {/*/>*/}



        {isSelected() && form.classOrManually === 'manually' ? <div>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleAdd}>
            Add
          </Button>

          {form.options.map((option, index) =>
            <div>
              <GeneralField
                key={option.key}
                label={'Option Label ' + (index + 1)}
                value={form.options[index].label}
                required
                onChange={e => form.options[index].label = e.target.value}
                sx={{mt: '16px', minWidth: 350}}
                error={!!errors.options && !! errors.options[option.key]}
                helperText={!!errors.options && errors.options[option.key]}
              />
              <Button variant="contained" color="primary" className={classes.button} key={option.key + 1}
                      onClick={() => {
                        if(index !== 0 || (index === 0 && form.options.length > 1)){
                          const temp = [...form.options]
                          temp.splice(index, 1)
                          setForm(form => ({...form, options: [...temp]}))
                        }

                      }}>
                Remove
              </Button>
            </div>
          )}
        </div> : <div/>}


        <Button variant="contained" color="primary" className={classes.button} onClick={validate}>
          Submit
        </Button>

        {/*<AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}*/}
        {/*             dialogTitle={'Are you sure you want to submit?'}*/}
        {/*             buttons={[<Button onClick={handleCancel} key={'cancel'}>{'cancel'}</Button>,*/}
        {/*               // <Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>,*/}
        {/*               <LoadingButton noDefaultStyle variant="text" color="primary" loading ={state.loadingButton} key={'confirm'}*/}
        {/*                              onClick={handleConfirm} children='confirm' autoFocus/>]}*/}
        {/*             open={state.submitDialog}/>*/}
        {/*<AlertDialog dialogContentText={"You are successfully registered"}*/}
        {/*             dialogTitle={'Success'}*/}
        {/*             buttons={[<Button onClick={() => {history.push('/login')}} key={'success'}> {'ok'}</Button>]}*/}
        {/*             open={state.successDialog}/>*/}
        {/*<AlertDialog dialogContentText={state.errors.message || "Fail to update"}*/}
        {/*             dialogTitle={'Fail'}*/}
        {/*             buttons={[<Button onClick={() => {history.push('/login')}} key={'fail'}>{'ok'}</Button>]}*/}
        {/*             open={state.failDialog}/>*/}
      </Paper>

    </Container>

  )


}