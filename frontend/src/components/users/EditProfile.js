import React, {useEffect, useState, useContext} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {Box, Button, Container, Grid, Typography} from "@mui/material";
import {userProfileFields} from "../../constants/userProfileFields";
import {fetchUser, getProfile, updateProfile, updateUser} from "../../api/userApi";
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

/* Page for editing User Profile, functionalities including:
*   - edit account information
*   - edit primary/secondary email
* */

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

  const profileForm = {
    givenName: userContext.givenName,
    familyName: userContext.familyName,
    telephone: userContext.countryCode.toString() +
      userContext.areaCode.toString() + userContext.phoneNumber.toString(),
    email: userContext.email,
    altEmail: userContext.altEmail,
  }

  useEffect(() => {
    getProfile(id).then(user => {
      setForm(profileForm);
      setLoading(false);
    });
  }, [id]);

  // Helper function for checking the validity of information in the fields. (frontend check)
  const validate = () => {
    const newErrors = {};

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

  // submit button handler
  const handleSubmitChanges = () => {
    if (validate()) {
      setDialogSubmit(true);
    }
  }

  // confirmation dialog confirm button handler
  const handleDialogConfirm = async () => {
    try {
      console.log(form)
      const phone = form.telephone.split(' ');
      console.log(phone)
      const countryCodeParse = parseInt(phone[0]);
      console.log(countryCodeParse)
      const areaCodeParse = parseInt(phone[1].slice(1,4));
      console.log(areaCodeParse)
      const phoneNumberParse = parseInt(phone[2].slice(0,3) + phone[2].slice(4,8));
      console.log(phoneNumberParse)

      const updateForm = {
        givenName: form.givenName,
        familyName: form.familyName,
        countryCode: countryCodeParse,
        areaCode: areaCodeParse,
        phoneNumber: phoneNumberParse,
        email: form.email,
        altEmail: form.altEmail,
      }
      console.log('reach before update profile')
      const {success} = await updateProfile(id, updateForm);
      console.log('reach after update profile')
      if (success) {

        userContext.email =updateForm.email;
        userContext.altEmail = updateForm.altEmail;
        userContext.givenName = updateForm.givenName;
        userContext.familyName = updateForm.familyName;
        userContext.countryCode = updateForm.countryCode;
        userContext.areaCode = updateForm.areaCode;
        userContext.phoneNumber = updateForm.phoneNumber;

        userContext.updateUser({
          email: userContext.email,
          altEmail: userContext.altEmail,
          givenName: userContext.givenName,
          familyName: userContext.familyName,
          countryCode: userContext.countryCode,
          areaCode: userContext.areaCode,
          phoneNumber: userContext.phoneNumber,
        });

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
          dialogContentText={"Note that if you want to change your primary email, you will receive a " +
            "confirmation link in your input email."}
          dialogTitle={'Are you sure to submit?'}
          buttons={[
            <Button onClick={() => setDialogSubmit(false)} key={'cancel'}>{'cancel'}</Button>,
            <Button onClick={handleDialogConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>]}
          open={dialogSubmit}/>

      </div>


    </Container>
  )
}