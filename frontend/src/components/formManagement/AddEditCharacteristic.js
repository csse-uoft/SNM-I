import React, { useEffect, useState } from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {fetchUsers} from "../../api/userApi";
import {defaultAddEditQuestionFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {Button, Container, TextField} from "@mui/material";
import SelectField from '../shared/fields/SelectField.js'
import {userFirstEntryFields} from "../../constants/userFirstEntryFields";
import {AlertDialog} from "../shared/Dialogs";
import LoadingButton from "../shared/LoadingButton";
import {addEditQuestionFields} from "../../constants/addEditQuestionFields";
import Dropdown from "../shared/fields/MultiSelectField";




const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  },
}));


export default function AddEditCharacteristic(){

  const classes = useStyles();
  const history = useHistory();
  const {id, option} = useParams();

  const [state, setState] = useState({
    loading: true,
    form:{
      ...defaultAddEditQuestionFields
    },
    errors: {}
  })

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

  return (

    <Container className={classes.root}>
      <TextField
        key={'label'}
        label={'label'}
        value={state.form.label}
        required
        onChange={e => state.form.label = e.target.value}
        // onBlur={() => handleOnBlur(field, option)}
        error={!!state.errors.label}
        helperText={state.errors.label}
        sx={{mt: '16px', minWidth: 350}}
      />
      <SelectField
        key={"dataType"}
        label={'Data Type'}
        InputLabelProps={{id:'dataType', }}
        options={{DataType_1: 'String', DataType_2: 'Date'}}
        value={state.form.dataType}
        noEmpty={true}
        required
        onChange={e => state.form.dataType = e.target.value}
        // onBlur={() => handleOnBlur(field, option)}
        error={!!state.errors.dataType}
        helperText={state.errors.dataType}
      />
      <SelectField
        key={"fieldType"}
        label={'Field Type'}
        InputLabelProps={{id:'FieldType', }}
        options={{InputField_1: 'TextField', InputField_2: 'Select'}}
        value={state.form.fieldType}
        noEmpty={true}
        required
        onChange={e => state.form.fieldType = e.target.value}
        // onBlur={() => handleOnBlur(field, option)}
        error={!!state.errors.fieldType}
        helperText={state.errors.fieldType}
      />
      <SelectField
        key={"optionsFromClass"}
        label={'Options From Class'}
        InputLabelProps={{id:'optionsFromClass', }}
        options={{class_1: 'Provider', class_2: 'Organization'}}
        value={state.form.optionsFromClass}
        noEmpty={true}
        required
        onChange={e => state.form.optionsFromClass = e.target.value}
        // onBlur={() => handleOnBlur(field, option)}
        error={!!state.errors.optionsFromClass}
        helperText={state.errors.optionsFromClass}
      />
      {/*<Dropdown*/}
      {/*  options={}*/}
      {/*  label={'Options From Class'}*/}
      {/*  value={state.form.optionsFromClass}*/}
      {/*  onChange={e => state.form.optionsFromClass = e.target.value}*/}
      {/*  error={!!state.errors.optionsFromClass}*/}
      {/*  helperText={state.errors.optionsFromClass}*/}
      {/*  required*/}
      {/*/>*/}
      <TextField
        key={'description'}
        label={'Description'}
        value={state.form.description}
        required
        sx={{mt: '16px', minWidth: 350}}
        onChange={e => state.form.description = e.target.value}
        // onBlur={() => handleOnBlur(field, option)}
        error={!!state.errors.description}
        helperText={state.errors.description}
      />



      {/*<Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>*/}
      {/*  Submit*/}
      {/*</Button>*/}

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
    </Container>

  )


}