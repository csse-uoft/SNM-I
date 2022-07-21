import React, { useEffect, useState } from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {fetchUsers} from "../../api/userApi";
import {defaultAddEditQuestionFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {Button, Container, TextField} from "@mui/material";
import PasswordHint from "../shared/PasswordHint";
import {userFirstEntryFields} from "../../constants/userFirstEntryFields";
import {AlertDialog} from "../shared/Dialogs";
import LoadingButton from "../shared/LoadingButton";




const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));


export default function AddEditQuestion(){

  const classes = useStyles();
  const history = useHistory();
  const {id, option} = useParams();

  const [state, setState] = useState({
    loading: true,
    form:{
      ...defaultAddEditQuestionFields
    },
  })

  useEffect(() => {
    fetchUsers().then(data => {
      if(option === 'edit'){
        setState(state => ({...state, loading: false, form: data.form}));
      }else{
        setState(state => ({...state, loading: false}))
      }
    }); //Todo add error handler here
  }, []);


  if(state.loading){
    return <Loading message={'Loading'}/>
  }

  return (

    <Container className={classes.root}>

      {Object.entries(userFirstEntryFields).map(([field, option]) => {
        // if (option.validator && !!option.validator(state.form[field]))
        // setState(state => ({...state, errors: {...state.errors, field: option.validator(state.form[field])}}));
        // state.errors[field] = option.validator(state.form[field])
        return (

          <option.component
            key={field}
            label={option.label}
            type={option.type}
            options={option.options}
            value={state.form[field]}
            required={option.required}
            onChange={e => state.form[field] = e.target.value}
            onBlur={() => handleOnBlur(field, option)}
            error={!!state.errors[field]}
            helperText={state.errors[field]}
          />
        )
      })}

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