import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import React, {useState} from 'react';
import {defaultNewPasswordFields} from "../constants/default_fields";
import {Loading} from "./shared";
import {verifyForgotPasswordUser} from "../api/userApi";
import {Button, Container, TextField} from "@mui/material";
import {userFirstEntryFields} from "../constants/userFirstEntryFields";
import {AlertDialog} from "./shared/Dialogs";
import {newPasswordFields} from "../constants/updatePasswordFields";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));

export default function ForgotPasswordResetPassword(){
  const classes = useStyles();
  const history = useHistory();
  const {token} = useParams();

  const [state, setState] = useState({
    form: {
      ...defaultNewPasswordFields
    },
    errors: {},
    submitDialog: false,
    successDialog: false,
    failDialog: false,
    verified: 0, // 0 means haven't verified, 1 means verified, 2 means fail to verified
    loading: true,
    email: '',
    id:'',
    failMessage:''
  });



  const verifyToken = async (token) => {
    try{
      const {email, message, success, userId} = await verifyForgotPasswordUser(token)
      setState(state => ({...state, verified: 1, email: email, id: userId, loading: false}))
    }catch (e){
      setState(state => ({...state, verified: 2, loading: false, errors: e.json}))
    }
  }

  if (state.verified === 0){
    verifyToken(token)
  }

  if (state.loading)
    return <Loading message={`Loading`}/>;

  if(state.verified === 1){
    return (
      <Container className={classes.root}>
        <TextField
          sx={{mt: '16px', minWidth: 350}}
          value={state.email}
          label={'Email'}
          disabled
        />
        {Object.entries(newPasswordFields).map(([field, option]) => {
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
              // onBlur={() => handleOnBlur(field, option)}
              error={!!state.errors[field]}
              helperText={state.errors[field]}
            />
          )
        })}

        <Button variant="contained" color="primary" className={classes.button} onClick={()=>{}}>
          Submit
        </Button>

      </Container>

    )
  }


}