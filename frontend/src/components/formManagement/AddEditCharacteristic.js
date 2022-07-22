import React, { useEffect, useState } from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {fetchUsers} from "../../api/userApi";
import {defaultAddEditQuestionFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {Button, Container, Paper, TextField, Typography} from "@mui/material";
import SelectField from '../shared/fields/SelectField.js'
import AddableTextField from "../shared/fields/AddableTextField";
import {userFirstEntryFields} from "../../constants/userFirstEntryFields";
import {AlertDialog} from "../shared/Dialogs";
import LoadingButton from "../shared/LoadingButton";
import {addEditQuestionFields} from "../../constants/addEditQuestionFields";
import Dropdown from "../shared/fields/MultiSelectField";
import GeneralField from "../shared/fields/GeneralField";




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


export default function AddEditCharacteristic(){

  const classes = useStyles();
  const history = useHistory();
  const {id, option} = useParams();

  const [state, setState] = useState({
    loading: true,

    errors: {}
  })

  const [form, setForm] = useState({
  ...defaultAddEditQuestionFields
  })

  const handleAdd = () => {
    setForm(form => ({...form, options: form.options.concat({label: ''})}))
  }

  const handleRemove = () => {
    setForm(form => ({...form, options: form.options.splice(0, form.options.length - 1)}))
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

  return (

    <Container maxWidth='sm'>
      <Paper sx={{p:2}} variant={'outlined'}>
        <Typography variant={'h4'}> Title </Typography>
        <GeneralField
          key={'label'}
          label={'label'}
          value={form.label}
          required
          onChange={e => form.label = e.target.value}
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
          value={form.dataType}
          noEmpty={true}
          required
          onChange={e => form.dataType = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!state.errors.dataType}
          helperText={state.errors.dataType}
        />
        <SelectField
          key={"fieldType"}
          label={'Field Type'}
          InputLabelProps={{id:'FieldType', }}
          options={{InputField_1: 'TextField', InputField_2: 'Select'}}
          value={form.fieldType}
          noEmpty={true}
          required
          onChange={e => form.fieldType = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!state.errors.fieldType}
          helperText={state.errors.fieldType}
        />
        <SelectField
          key={"optionsFromClass"}
          label={'Options From Class'}
          InputLabelProps={{id:'optionsFromClass', }}
          options={{class_1: 'Provider', class_2: 'Organization'}}
          value={form.optionsFromClass}
          noEmpty={true}
          required
          onChange={e => form.optionsFromClass = e.target.value}
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
        <GeneralField
          key={'description'}
          label={'Description'}
          value={form.description}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.description = e.target.value}
          // onBlur={() => handleOnBlur(field, option)}
          error={!!state.errors.description}
          helperText={state.errors.description}
          multiline
        />

        <Button variant="contained" color="primary" className={classes.button} onClick={handleAdd}>
          Add
        </Button>

        {form.options.map((option, index) =>
          <div>
              <GeneralField
                key={index}
                label={'Option Label ' + (index + 1)}
                value={form.options[index].label}
                required
                onChange={e => form.options[index].label = e.target.value}
                sx={{mt: '16px', minWidth: 350}}
              />
              {/*<Button variant="contained" color="primary" className={classes.button}*/}
              {/*        onClick={() => {*/}
              {/*          const temp = [...form.options]*/}
              {/*          temp.splice(index, 1)*/}
              {/*          console.log(temp)*/}
              {/*          setForm(form => ({...form, options: [...temp]}))*/}
              {/*        }}>*/}
              {/*  Remove*/}
              {/*</Button>*/}
          </div>



        )}

        <Button variant="contained" color="primary" className={classes.button}
                onClick={handleRemove}>
          Remove
        </Button>





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
      </Paper>

    </Container>

  )


}