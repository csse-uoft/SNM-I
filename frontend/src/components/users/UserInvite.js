import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router";

import {defaultUserFields} from "../../constants/default_fields";
import {Button, Container, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {userInvitationFields} from "../../constants/userInvitationFields";
import {fetchUser, updateUser, createUser} from "../../api/userApi";
import {Loading} from "../shared"
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
      ...defaultUserFields
    },
    errors: {},
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

  const handleSubmit = async () => {
    if (validate()) {
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
            error={!!state.errors[field]}
            helperText={state.errors[field]}
          />
        )
      })}
      <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  )
}