import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import React, {useState} from 'react';
import {defaultNewPasswordFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {forgotPasswordSaveNewPassword, verifyForgotPasswordUser} from "../../api/userApi";
import {Button, Container, TextField} from "@mui/material";
import {AlertDialog} from "../shared/Dialogs";
import {newPasswordFields} from "../../constants/updatePasswordFields";
import {isFieldEmpty} from "../../helpers";
import {REQUIRED_HELPER_TEXT} from "../../constants";
import LoadingButton from "../shared/LoadingButton";
import PasswordHint from "../shared/PasswordHint";


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
    loadingButton: false
  });



  const verifyToken = async (token) => {
    try{
      const {email, message, success, userId} = await verifyForgotPasswordUser(token)
      setState(state => ({...state, verified: 1, email: email, id: userId, loading: false}))
    }catch (e){
      setState(state => ({...state, verified: 2, loading: false, errors: e.json, failDialog: true,}))
    }
  }

  if (state.verified === 0){
    verifyToken(token)
  }

  if (state.loading)
    return <Loading message={`Loading`}/>;

  const handleOnBlur = (field, option) => {

    if (!isFieldEmpty(state.form[field]) && field === "repeatNewPassword"
      && !!option.validator(state.form[field], state.form["newPassword"])) {
      setState(state => ({
        ...state,
        errors: {...state.errors, [field]: option.validator(state.form[field], state.form["newPassword"])}
      }))

    } else if (!isFieldEmpty(state.form[field]) && field !== "repeatNewPassword" && option.validator
      && !!option.validator(state.form[field])) {

      setState(state => ({...state, errors: {...state.errors, [field]: option.validator(state.form[field])}}))
    } else {
      setState(state => ({...state, errors: {...state.errors, [field]: undefined}}))
    }

  };

  const validate = () => {
    const errors = {};
    for (const [field, option] of Object.entries(newPasswordFields)) {
      const isEmpty = isFieldEmpty(state.form[field]);
      if (option.required && isEmpty) {
        errors[field] = REQUIRED_HELPER_TEXT;
      }
      let msg;
      if (!isEmpty && field === "repeatNewPassword" && (msg = option.validator(state.form[field], state.form["newPassword"]))) {
        errors[field] = msg
      } else if (!isEmpty && field !== "repeatNewPassword" && option.validator && (msg = option.validator(state.form[field]))) {
        errors[field] = msg;
      }
    }
    if (Object.keys(errors).length !== 0) {
      setState(state => ({...state, errors}));
      return false
    }
    return true;

  };

  const handleCancel = () => {
    setState(state => ({...state, submitDialog: false}))
  }

  const handleConfirm = async () => {
    try {
      setState(state => ({...state, loadingButton: true}))
      const {success, message} = await forgotPasswordSaveNewPassword({email: state.email, password: state.form.newPassword})
      if(success){
        setState(state => ({...state, successDialog: true, loadingButton: false, submitDialog: false,}))
      }
      // since the backend will definitely return 400 as status code if forgotPasswordSaveNewPassword failed

    } catch (e) {
      if (e.json) {
        setState(state => ({...state, loadingButton: false, errors: e.json, failDialog: true,submitDialog: false,}));
      }
    }

  };

  const handleSubmit = () => {
    if (validate()) {
      setState(state => ({...state, submitDialog: true}))
    }
  }

  if(state.verified === 1){
    return (
      <Container className={classes.root}>
        <PasswordHint/>
        <TextField
          sx={{mt: '16px', minWidth: 350}}
          value={state.email}
          label={'Email'}
          disabled
        />
        {Object.entries(newPasswordFields).map(([field, option]) => {

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

        <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
          Submit
        </Button>

        <AlertDialog dialogContentText={"Note that you won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={'Are you sure to submit?'}
                     buttons={[<Button onClick={handleCancel} key={'cancel'}>{'cancel'}</Button>,
                       // <Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading ={state.loadingButton} key={'confirm'}
                                      onClick={handleConfirm} children='confirm' autoFocus/>]}
                     open={state.submitDialog}/>

        <AlertDialog dialogContentText={"You have successfully reset your password, please login"}
                     dialogTitle={'Success'}
                     buttons={[<Button onClick={() => {history.push('/login')}} key={'ok'}> {'ok'}</Button>]}
                     open={state.successDialog}/>

        <AlertDialog dialogContentText={state.errors.message || "Error occurs"}
                     dialogTitle={'Error'}
                     buttons={[<Button onClick={() => {history.push('/login')}} key={'ok'}> {'ok'}</Button>]}
                     open={state.failDialog}/>

      </Container>

    )
  }

  if(state.verified === 2){
    return(
      <AlertDialog dialogContentText={state.errors.message || "Token invalid"}
                   dialogTitle={'Error'}
                   buttons={[<Button onClick={() => {history.push('/login')}} key={'ok'}> {'ok'}</Button>]}
                   open={state.failDialog}/>
    )
  }


}