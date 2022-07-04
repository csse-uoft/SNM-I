import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router";

import {defaultInvitationFields} from "../../constants/default_fields";
import {Alert, AlertTitle, Button, Container, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {userInvitationFields} from "../../constants/userInvitationFields";
import {fetchUser, updateUser, createUser} from "../../api/userApi";
import {Loading} from "../shared"
import {AlertDialog} from "../shared/Dialogs"
import {isFieldEmpty} from "../../helpers";
import {REQUIRED_HELPER_TEXT} from "../../constants";


const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));

export default function UserInvite() {
  const classes = useStyles();
  const history = useHistory();
  // const {id} = useParams();
  // const mode = id == null ? 'new' : 'edit';
  const [state, setState] = useState({
    form: {
      ...defaultInvitationFields
    },
    errors: {},
    dialog: false,
    success: false,
    fail: false,
    failMessage: ''
  });

  // useEffect(() => {
  //   if (mode === 'edit') {
  //     fetchUser(id).then(user => {
  //       setState(state => ({
  //         ...state,
  //         form: {
  //           ...state.form,
  //           ...user
  //         },
  //         loading: false,
  //       }))
  //     })
  //   } else
  //     setState(state => ({...state, loading: false}));
  // }, [mode, id]);

  /**
   * @returns {boolean} true if valid.
   */
  const validate = () => {
    const errors = {};
    for (const [field, option] of Object.entries(userInvitationFields)) {
      const isEmpty = isFieldEmpty(state.form[field]);
      if (option.required && isEmpty) {
        errors[field] = REQUIRED_HELPER_TEXT;
      }
      let msg;
      if (!isEmpty && option.validator && (msg = option.validator(state.form[field]))) {
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

    console.log('valid')
    try {

      const {success, message} = await createUser(state.form);
      setState(state => ({...state, dialog: false}))
      if (success) {
        setState(state => ({...state, success: true}))
      } else {
        setState(state => ({...state, failMessage: message}))
      }


    } catch (e) {
      if (e.json) {
        setState(state => ({...state, errors: e.json}))
        setState(state => ({...state, fail: true}))
      }
    }

  };

  const handleOnBlur = (field, option) => {

    if (!isFieldEmpty(state.form[field]) && option.validator && !!option.validator(state.form[field]))
      // state.errors.field = option.validator(e.target.value)
      setState(state => ({...state, errors: {...state.errors, [field]: option.validator(state.form[field])}}))
    //console.log(state.errors)
    else {
      setState(state => ({...state, errors: {...state.errors, [field]: undefined}}))
    }

  };


  return (
    <Container className={classes.root}>
      <Typography variant="h5">
        {/*{mode === 'new' ? 'Create new user' : 'Edit user'}*/}
        {'Create new user'}
      </Typography>
      {Object.entries(userInvitationFields).map(([field, option]) => {

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
                   open={state.dialog}/>
      <AlertDialog dialogContentText={"The user is invited successfully."}
                   dialogTitle={'Success'}
                   buttons={[<Button onClick={() => history.push('/dashboard')} key={'ok'}>{'ok'}</Button>]}
                   open={state.success}/>
      <AlertDialog dialogContentText={state.failMessage||"Error occur"}
                   dialogTitle={'Fail'}
                   buttons={[<Button onClick={() => history.push('/dashboard')} key={'ok'}>{'ok'}</Button>]}
                   open={state.fail}/>



    </Container>
  )
}