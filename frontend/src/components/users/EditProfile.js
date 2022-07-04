import React, {useEffect, useState, useContext} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {Box, Button, Container, Grid, Typography} from "@mui/material";
import {userProfileFields} from "../../constants/userProfileFields";
import {fetchUser, getProfile, updateUser} from "../../api/userApi";
import {defaultUserFields} from "../../constants/default_fields";
import {isFieldEmpty} from "../../helpers";
import {
  DUPLICATE_HELPER_TEXT,
  DUPLICATE_PHONE_HELPER_TEXT,
  REQUIRED_HELPER_TEXT
} from "../../constants";
import {AlertDialog} from "../shared/Dialogs";
import {Loading} from "../shared";
import {UserContext} from "../../context";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));

export default function EditProfile() {
  const classes = useStyles();
  const history = useHistory();
  const {id} = useParams();
  const userContext = useContext(UserContext);
  const [form, setForm] = useState({...userProfileFields});
  const [errors, setErrors] = useState({});
  const [dialogSubmit, setDialogSubmit] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getProfile(id).then(user => {
      setForm(userContext);
      setLoading(false);
    });
  }, [id]);

  // Helper function for checking the validity of information in the fields. (frontend check)
  const validate = () => {
    const newErrors = {};
    console.log(form)

    for (const [field, option] of Object.entries(userProfileFields)) {
      const isEmpty = isFieldEmpty(form[field]);

      if (option.required && isEmpty) {
        newErrors[field] = REQUIRED_HELPER_TEXT;
      }
      let msg;
      if (!isEmpty && option.validator && (msg = option.validator(form[field]))) {
        newErrors[field] = msg;
      }

      if (option.label === 'Secondary Email') {
        console.log(form.email, form.altEmail)
        if (form.email === form.altEmail) {
          console.log("same");
          newErrors[field] = DUPLICATE_HELPER_TEXT;
        } else {
          console.log('different');
        }
      }
    }

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return false
    }

    return true;
  };

  const handleSubmitChanges = () => {
    if (validate()) {
      setDialogSubmit(true);
    }
  }


  const handleDialogConfirm = async () => {
    try {
      const {success, data} = await updateUser(id, form);
      if (success) {
        console.log(userContext)
        userContext.updateUser({
          email: form.email,
          altEmail: form.altEmail,
          givenName: form.givenName,
          familyName: form.familyName,
          telephone: form.telephone,
        });
        console.log(userContext)
        history.push('/profile/' + id + '/');
      }
    } catch (e) {
      console.log( e.json);
    }
  };


  // OnBlur handler, called when user's focus moves from a field.
  const handleOnBlur = (e, field, option) => {
    if (!isFieldEmpty(form[field]) && option.validator && !!option.validator(form[field]))
      // state.errors.field = option.validator(e.target.value)
      setErrors({...errors, [field]: option.validator(form[field])});
    else
      setErrors({...errors, [field]: undefined});
  };

  if (loading)
    return <Loading message={`Loading...`}/>;


  return (
    <Container className={classes.root}>
      <Typography variant="h4">
        {'User Profile'}
      </Typography>

      <div>
        {/* Fields for account information */}
        {Object.entries(userProfileFields).map(([field, option]) => {
          return (
            <option.component
              key={field}
              label={option.label}
              type={option.type}
              options={option.options}
              value={form[field]}
              required={option.required}
              onChange={value => form[field] = value.target.value}
              //onChange={e => state.form[field] = e.target.value}
              onBlur={e => handleOnBlur(e, field, option)}
              error={!!errors[field]}
              helperText={errors[field]}
            />)

        })}

        {/* Button for submitting account info changes */}
        <Button variant="contained" color="primary" className={classes.button}
                onClick={handleSubmitChanges}>
          Submit Changes
        </Button>


        {/* Alert prompt for submitting changes */}
        <AlertDialog
          dialogContentText={"Note that you won't be able to edit the information after clicking CONFIRM."}
          dialogTitle={'Are you sure to submit?'}
          buttons={[
            <Button onClick={() => setDialogSubmit(false)} key={'cancel'}>{'cancel'}</Button>,
            <Button onClick={handleDialogConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>]}
          open={dialogSubmit}/>

      </div>


    </Container>
  )
}