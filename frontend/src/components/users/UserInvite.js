import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router";

import {defaultUserFields} from "../../constants/default_fields";
import {Button, Container, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {userInvitationFields} from "../../constants/userInvitationFields";
import {fetchUser, updateUser, createUser} from "../../api/userApi";
import {Loading} from "../shared"
import {AlertDialog} from "../shared/Dialogs"
import {isFieldEmpty} from "../../helpers";
import {REQUIRED_HELPER_TEXT} from "../../constants";
import MuiPhoneNumber from 'material-ui-phone-number';

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
      ...defaultUserFields
    },
    errors: {},
    dialog: false
    // loading: true,
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
    console.log(state.form)
    if (validate()) {
      setState(state => ({...state, dialog: true}))
    }
  }

  const handleCancel = () => {
    setState(state => ({...state, dialog: false}))
    console.log("cancel")
  }

  const handleConfirm = async () => {
    if (true) {
      console.log('valid')
      try {
        // if (mode === 'new') {
        await createUser(state.form);
        history.push('/users/');
        // } else {
        //   await updateUser(id, state.form);
        //   history.push('/users/' + id);
        // }

      } catch (e) {
        if (e.json) {
          setState(state => ({...state, errors: e.json}));
        }
      }
    }
  };

  const handleOnBlur = (e, field, option) => {
    if (!isFieldEmpty(state.form[field]) && option.validator && !!option.validator(state.form[field]))
      // state.errors.field = option.validator(e.target.value)
      setState(state => ({...state, errors: {...state.errors, [field]: option.validator(state.form[field])}}))
    //console.log(state.errors)
    else
      setState(state => ({...state, errors: {...state.errors, [field]: undefined}}))
  };


  return (
    <Container className={classes.root}>
      <Typography variant="h5">
        {/*{mode === 'new' ? 'Create new user' : 'Edit user'}*/}
        {'Create new user'}
      </Typography>
      {Object.entries(userInvitationFields).map(([field, option]) => {
        // if (option.validator && !!option.validator(state.form[field]))
        // setState(state => ({...state, errors: {...state.errors, field: option.validator(state.form[field])}}));
        // state.errors[field] = option.validator(state.form[field])
        if (option.type ==='phoneNumber')
          return(
            <option.component
              key={field}
              label={option.label}
              type={option.type}
              options={option.options}
              required={option.required}
              onChange={value => state.form[field] = value}
              onBlur={e => handleOnBlur(e, field, option)}
              error={!!state.errors[field]}
              helperText={state.errors[field]}
            />
          )
        else return (

          <option.component
            key={field}
            label={option.label}
            type={option.type}
            options={option.options}
            value={state.form[field]}
            required={option.required}
            onChange={e => state.form[field] = e.target.value}
            onBlur={e => handleOnBlur(e, field, option)}
            error={!!state.errors[field]}
            helperText={state.errors[field]}
          />
        )
      })}
      {/*<MuiPhoneNumber defaultCountry={'ca'} onChange={value => state.form.phone = value} sx={{mt: '16px', minWidth: 350}}*/}
      {/*                variant="outlined" label="Phone number"*/}
      {/*/>*/}
      <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
        Submit
      </Button>
      <AlertDialog dialogContentText={"Note that you won't be able to edit the information after clicking CONFIRM."}
                   dialogTitle={'Are you sure to submit?'}
                   buttons={[<Button onClick={handleCancel} key={'cancel'}>{'cancel'}</Button>,
                     <Button onClick={handleConfirm} key={'confirm'}autoFocus> {'confirm'}</Button>]}
                   // buttons={{'cancel': handleCancel, 'confirm': handleConfirm}}
                   open={state.dialog}/>
    </Container>
  )
}