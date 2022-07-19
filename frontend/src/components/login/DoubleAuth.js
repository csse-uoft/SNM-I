import {makeStyles} from "@mui/styles";
import {useHistory} from "react-router";
import React, { useEffect, useState, useContext } from 'react';
import {
  LoginCheckSecurityQuestion,
} from "../../api/userApi";
import {getUserSecurityQuestionsLogin} from "../../api/auth";
import {defaultSecurityQuestionsFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {Button, Container, Typography} from "@mui/material";
import LoadingButton from "../shared/LoadingButton";
import {AlertDialog} from "../shared/Dialogs";
import {loginDoubleAuthFields} from "../../constants/login_double_auth_fields";
import { UserContext } from "../../context";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));



export default function DoubleAuth() {
  const classes = useStyles();
  const history = useHistory();
  const userContext = useContext(UserContext);

  const [state, setState] = useState({
    loading: true,
    group: 1,
    form: {...defaultSecurityQuestionsFields},
    errors: {
    group1: {},
    group2: {},
    group3: {},
    },
    email: '',
    loadingButton: false,
    errorDialog: false
  });

  useEffect(() => {
    getUserSecurityQuestionsLogin().then(response => {
      if (response.success){
        const securityQuestions = response.data.securityQuestions
        state.form.group1.securityQuestion1 = securityQuestions.splice(Math.floor(Math.random() * securityQuestions.length), 1)[0]
        state.form.group2.securityQuestion2 = securityQuestions.splice(Math.floor(Math.random() * securityQuestions.length), 1)[0]
        state.form.group3.securityQuestion3 = securityQuestions.splice(Math.floor(Math.random() * securityQuestions.length), 1)[0]
        setState(state => ({...state, loading: false, email: response.data.email}));
      }

    }).catch(e =>{
      if(e.json){
        setState(state => ({...state, errors: e.json, errorDialog: true, loading: false}))
      }
    });
  }, []);

  const handleSubmit = async () => {
    setState(state => ({...state, loadingButton: true}))
    try{
      if(state.group < 4){
        const group = 'group' + state.group
        const securityQuestionAnswer = 'securityQuestionAnswer' + state.group
        const answer = state.form[group][securityQuestionAnswer]
        const securityQuestion = 'securityQuestion' + state.group

        const {success, message, matched, userAccount} = await LoginCheckSecurityQuestion({email: state.email,
          question: state.form[group][securityQuestion], answer})

        if(matched){
          userContext.updateUser({
            id: userAccount._id,
            isAdmin: userAccount.role === 'admin',
            email: userAccount.primaryEmail,
            altEmail: userAccount.secondaryEmail,
            displayName: userAccount.displayName,
            givenName: userAccount.primaryContact?.givenName,
            familyName: userAccount.primaryContact?.familyName,
            countryCode: userAccount.primaryContact?.telephone?.countryCode,
            areaCode: userAccount.primaryContact?.telephone?.areaCode,
            phoneNumber: userAccount.primaryContact?.telephone?.phoneNumber,
          });

          setState(state => ({...state, loadingButton: false}))
          history.push('/dashboard')

        }else{
          setState(state => ({...state, group: state.group + 1, loadingButton: false}))
        }
      }
    }catch (e){
      if (e.json) {
        setState(state => ({...state, errors: e.json, errorDialog: true, loadingButton: false}))
      }
    }
  }

  if(state.loading)
    return <Loading message={`Loading`}/>

  const group = 'group' + state.group

  if(state.group < 4) {
    return (
      <Container className={classes.root}>
        <Typography variant="h5">
          {'Please answer security question'}
        </Typography>

        {Object.entries(loginDoubleAuthFields[group]).map(([field, option]) => {

          return (

            <option.component
              key={field}
              label={option.label}
              type={option.type}
              options={option.options}
              value={state.form[group][field]}
              required={option.required}
              onChange={e => state.form[group][field] = e.target.value}
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
                     buttons={[<Button onClick={() => history.push('/')} key={'ok'}>{'ok'}</Button>]}
                     open={state.errorDialog}/>
        {/*<AlertDialog dialogContentText={'A link has been sent to your email address. Please follow it to reset your password'}*/}
        {/*             dialogTitle={'Success'}*/}
        {/*             buttons={[<Button onClick={() => history.push('/')} key={'ok'}>{'ok'}</Button>]}*/}
        {/*             open={state.successDialog}/>*/}
      </Container>)
  }else{
    // the user wasted all 3 chances, the user should remove id from req but haven't implemented TODO
    return (
      <AlertDialog dialogContentText={'You have missed all 3 chances'}
                   dialogTitle={'Sorry'}
                   buttons={[<Button onClick={() => history.push('/')} key={'ok'}>{'ok'}</Button>]}
                   open={state.group > 3}/>
    )
  }
}