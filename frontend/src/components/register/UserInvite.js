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
    failMessage: '',
    // loading: false,
    loadingButton: false
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
      setState(state => ({...state, loadingButton: true }))
      const {success, message} = await createUser(state.form);
      setState(state => ({...state, loadingButton: false, success: true, dialog: false}))

    } catch (e) {
      if (e.json) {
        setState(state => ({...state, errors: e.json, fail: true, loadingButton: false}))
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

  // if (state.loading)
  //   return <Loading message={`Loading`}/>;


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
      <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                   dialogTitle={'Are you sure you want to submit?'}
                   buttons={[<Button onClick={handleCancel} key={'cancel'}>{'cancel'}</Button>,
                     // <Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>,
                     <LoadingButton noDefaultStyle variant="text" color="primary" loading ={state.loadingButton} key={'confirm'}
                                    onClick={handleConfirm} children='confirm' autoFocus/>]}
                   open={state.dialog}/>
      <AlertDialog dialogContentText={"A registration link has been sent to the user."}
                   dialogTitle={'Success'}
                   buttons={[<Button onClick={() => history.push('/dashboard')} key={'ok'}>{'ok'}</Button>]}
                   open={state.success}/>
      <AlertDialog dialogContentText={state.errors.message||"Error occur"}
                   dialogTitle={'Fail'}
                   buttons={[<Button onClick={() => history.push('/dashboard')} key={'ok'}>{'ok'}</Button>]}
                   open={state.fail}/>



    </Container>
  )
}