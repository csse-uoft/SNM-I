import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import React, {useState} from "@types/react";
import {defaultFirstEntryFields} from "../../constants/default_fields";
import {fetchUser, updateUser, createUser} from "../../api/userApi";
import {Loading} from "../shared";
import {Button, Container} from "@mui/material";
import {userInvitationFields} from "../../constants/userInvitationFields";

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
  const {id} = useParams();
  const [state, setState] = useState({
    form: {
      ...defaultFirstEntryFields
    },
    errors: {},
    dialog: false,
  });






  return (
    <Container className={classes.root}>
      {Object.entries(userInvitationFields).map(([field, option]) => {
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
            onBlur={e => handleOnBlur(e, field, option)}
            error={!!state.errors[field]}
            helperText={state.errors[field]}
          />
        )
      })}
    </Container>

  )

    }