import {makeStyles} from "@mui/styles";
import {useHistory} from "react-router";
import React, {useState} from "react";
import {defaultForgotPasswordFields} from "../constants/default_fields";
import {Loading} from "./shared";
import {Button, Typography, Container} from "@mui/material";
import {userInvitationFields} from "../constants/userInvitationFields";
import {forgotPasswordFields} from "../constants/forgot_password_fields";
import {isFieldEmpty} from "../helpers";
import {REQUIRED_HELPER_TEXT} from "../constants";
import {checkSecurityQuestion, fetchSecurityQuestionsByEmail, sendVerificationEmail} from "../api/userApi";
import {AlertDialog} from "./shared/Dialogs";
import LoadingButton from "./shared/LoadingButton";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));


export default function ForgotPassword() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    form: {
      ...defaultForgotPasswordFields
    },
    errors: {
      group1: {},
      group2: {},
      group3: {},
      group4: {},
    },
    // loading: false,
    group:1,
    errorDialog: false,
    successDialog: false,
    loadingButton: false,
  });

  const handleSubmit = async () => {
    if (validate()) {
      try {
        setState(state => ({...state, loadingButton: true}))
        if (state.group === 1) {
          // get the user security questions
          const {success, message, securityQuestions} = await fetchSecurityQuestionsByEmail(state.form.group1.email)
          state.form.group2.securityQuestion1 = securityQuestions.splice(Math.floor(Math.random() * securityQuestions.length), 1)[0]
          state.form.group3.securityQuestion2 = securityQuestions.splice(Math.floor(Math.random() * securityQuestions.length), 1)[0]
          state.form.group4.securityQuestion3 = securityQuestions.splice(Math.floor(Math.random() * securityQuestions.length), 1)[0]
          setState(state => ({...state, group: state.group + 1, loadingButton: false}))

        } else {
          const group = 'group' + state.group
          const securityQuestionAnswer = 'securityQuestionAnswer' + (state.group - 1)
          const answer = state.form[group][securityQuestionAnswer]
          const securityQuestion = 'securityQuestion' + (state.group - 1)

          const {success, message, matched} = await checkSecurityQuestion({email: state.form.group1.email,
            question: state.form[group][securityQuestion], answer})

          if(matched){
            setState(state => ({...state,}))
            const {success, message} = await sendVerificationEmail({email: state.form.group1.email})
            setState(state => ({...state, loadingButton: false, successDialog: true}))

          }else{
            setState(state => ({...state, group: state.group + 1, loadingButton: false}))
          }

        }
      } catch (e) {
        if (e.json) {
          setState(state => ({...state, errors: e.json, errorDialog: true, loadingButton: false}))
        }


      }
    }
  }

    const validate = () => {
      const group = 'group' + state.group
      const errors = {
        group1: {},
        group2: {},
        group3: {},
        group4: {},
      }

      for (const [field, option] of Object.entries(forgotPasswordFields[group])) {
        const isEmpty = isFieldEmpty(state.form[group][field]);
        if (option.required && isEmpty) {
          errors[group][field] = REQUIRED_HELPER_TEXT;
        }
        let msg;
        if (!isEmpty && option.validator && (msg = option.validator(state.form[group][field]))) {
          errors[group][field] = msg;
        }
      }
      setState(state => ({...state, errors}));
      if (Object.keys(errors[group]).length > 0) {
        return false
      }
      return true

    }

    // if (state.loading)
    //   return <Loading message={`Loading`}/>;

    const group = 'group' + state.group

    if(state.group <= 4){
      return (
        <Container className={classes.root}>
          <Typography variant="h5">
            {'Forgot your password?'}
          </Typography>

          {Object.entries(forgotPasswordFields[group]).map(([field, option]) => {

            return (

              <option.component
                key={field}
                label={option.label}
                type={option.type}
                options={option.options}
                value={state.form[group][field]}
                required={option.required}
                onChange={e => state.form[group][field] = e.target.value}
                // onBlur={() => handleOnBlur(field, option)}
                disabled={option.disabled}
                error={!!state.errors[group][field]}
                helperText={state.errors[group][field]}
              />
            )
          })}
          {/*<Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>*/}
          {/*  Submit*/}
          {/*</Button>*/}
          <LoadingButton noDefaultStyle variant="contained" color="primary" loading ={state.loadingButton} className={classes.button}
                         onClick={handleSubmit}/>
          <AlertDialog dialogContentText={state.errors.message||"Error occur"}
                       dialogTitle={'Error'}
                       buttons={[<Button onClick={() => history.push('/dashboard')} key={'ok'}>{'ok'}</Button>]}
                       open={state.errorDialog}/>
          <AlertDialog dialogContentText={'A link is sent to your email address. Please follow it to reset your password'}
                       dialogTitle={'Success'}
                       buttons={[<Button onClick={() => history.push('/')} key={'ok'}>{'ok'}</Button>]}
                       open={state.successDialog}/>
        </Container>)



    }
  if(state.group > 4){
    // TODO: what should we do after user wasting all 3 chances?
    return (
      <AlertDialog dialogContentText={'You have missed all 3 chances'}
                   dialogTitle={'Sorry'}
                   buttons={[<Button onClick={() => history.push('/')} key={'ok'}>{'ok'}</Button>]}
                   open={state.group > 4}/>
    )
  }




}