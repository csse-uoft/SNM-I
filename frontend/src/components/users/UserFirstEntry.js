import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import React, {useEffect, useState} from 'react';
import {defaultFirstEntryFields} from "../../constants/default_fields";
import {createUser, firstEntryUpdate, updateUser, verifyUser} from "../../api/userApi";
import {Loading} from "../shared";
import {Button, Container, TextField} from "@mui/material";
import {userFirstEntryFields} from "../../constants/userFirstEntryFields";
import {isFieldEmpty} from "../../helpers";
import {userInvitationFields} from "../../constants/userInvitationFields";
import {REQUIRED_HELPER_TEXT} from "../../constants";
import {AlertDialog} from "../shared/Dialogs";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));

export default function UserFirstEntry() {
  const classes = useStyles();
  const history = useHistory();
  const {token} = useParams();


  const [state, setState] = useState({
    form: {
      ...defaultFirstEntryFields
    },
    errors: {},
    dialog: false,
    verified: false,
    loading: true,
    email: '',
    id:''
  });

  if (state.loading) {
    verifyToken({token})
    // setState(state => ({...state, loading: false}))
  }


  async function verifyToken(token) {
    try {
      const respond = await verifyUser(token);
      setState(state => ({...state, verified: true, email: respond.email, id: respond.userId, loading: false}))
    } catch (e) {
      // when the token is invalid TODO
      setState(state => ({...state, verified: false, loading: false}))
    }

  }

  const handleOnBlur = (field, option) => {

    if (!isFieldEmpty(state.form[field]) && field === "confirmPassword" && !!option.validator(state.form[field], state.form["password"])) {
      setState(state => ({
        ...state,
        errors: {...state.errors, [field]: option.validator(state.form[field], state.form["password"])}
      }))

    } else if (!isFieldEmpty(state.form[field]) && field !== "confirmPassword" && option.validator && !!option.validator(state.form[field])) {

      setState(state => ({...state, errors: {...state.errors, [field]: option.validator(state.form[field])}}))
    } else {
      setState(state => ({...state, errors: {...state.errors, [field]: undefined}}))
    }

  };

  const validate = () => {
    const errors = {};
    for (const [field, option] of Object.entries(userFirstEntryFields)) {
      const isEmpty = isFieldEmpty(state.form[field]);
      if (option.required && isEmpty) {
        errors[field] = REQUIRED_HELPER_TEXT;
      }
      let msg;
      if (!isEmpty && field === "confirmPassword" && (msg = option.validator(state.form[field], state.form["password"]))) {
        errors[field] = msg
      } else if (!isEmpty && field !== "confirmPassword" && option.validator && (msg = option.validator(state.form[field]))) {
        errors[field] = msg;
      }
    }
    if (Object.keys(errors).length !== 0) {
      setState(state => ({...state, errors}));
      return false
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      setState(state => ({...state, dialog: true}))
    }
  }

  const handleCancel = () => {
    setState(state => ({...state, dialog: false}))
  }

  const handleConfirm = async () => {
    try {
      const securityQuestions = [state.form.securityQuestion1, state.form.securityQuestion2, state.form.securityQuestion3,
        state.form.securityQuestionAnswer1, state.form.securityQuestionAnswer2, state.form.securityQuestionAnswer3]
      setState(state => ({...state, loading: true}))
      await firstEntryUpdate({email: state.email, userId: state.id, newPassword: state.form.password,
        securityQuestions: securityQuestions})
      // todo

    } catch (e) {
      if (e.json) {
        setState(state => ({...state, errors: e.json}));
      }
    }

  };


  if (state.loading)
    return <Loading message={`Loading`}/>;


  if (state.verified) {
    return (
      <Container className={classes.root}>
        <TextField
          sx={{mt: '16px', minWidth: 350}}
          value={state.email}
          label={'Email'}
          disabled
        />
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

        <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
          Submit
        </Button>

        <AlertDialog dialogContentText={"Note that you won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={'Are you sure to submit?'}
                     buttons={[<Button onClick={handleCancel} key={'cancel'}>{'cancel'}</Button>,
                       <Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>]}
          // buttons={{'cancel': handleCancel, 'confirm': handleConfirm}}
                     open={state.dialog}/>
      </Container>

    )
  } else {
    // when the token is invalid TODO
    history.push('/dashboard')
  }


}