import React, {useEffect, useState, useContext} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {Button, Container, Typography} from "@mui/material";
import {userProfileFields} from "../../constants/userProfileFields";
import {getProfile, updatePrimaryEmail, updateProfile} from "../../api/userApi";
import {isFieldEmpty} from "../../helpers";
import {
  DUPLICATE_HELPER_TEXT,
  REQUIRED_HELPER_TEXT
} from "../../constants";
import {AlertDialog} from "../shared/Dialogs";
import {Loading} from "../shared";
import LoadingButton from "../shared/LoadingButton";
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
    marginRight: 12,
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
  const [loadingButton, setLoadingButton] = useState(false);
  const [dialogEmail, setDialogEmail] = useState(false);
  let emailSent = false;

  const profileForm = {
    givenName: userContext.givenName,
    familyName: userContext.familyName,
    telephone: userContext.countryCode && (userContext.countryCode.toString() +
      userContext.areaCode.toString() + userContext.phoneNumber.toString()),
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
        if (form.email === form.altEmail) {
          newErrors[field] = DUPLICATE_HELPER_TEXT;
        }
      }
    }

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return false
    }

    return true;
  };

  const handleCancel = () => {
    alert('All the changes you made will not be saved.');
    history.push('/profile/' + id);
  }

  const handleDialogEmail =() => {
    setDialogEmail(false);
    history.push('/profile/' + id + '/');
  }

  // submit button handler
  const handleSubmitChanges = () => {
    if (validate()) {
      setDialogSubmit(true);
    }
  }

  // confirmation dialog confirm button handler
  const handleDialogConfirm = async () => {
    try {
      const phoneUnchanged = userContext.countryCode.toString() +
        userContext.areaCode.toString() + userContext.phoneNumber.toString()

      if (form.email !== userContext.email) {
        console.log('reach before send verification')
        const {sentEmailConfirm} = await updatePrimaryEmail(id, form.email);
        console.log(sentEmailConfirm)
        if (sentEmailConfirm) {
          emailSent = true;
          console.log('email verification link sent');
        } else {
          console.log('email verification is not sent.');
        }
      }

      if (form.telephone === phoneUnchanged) {
        const countryCodeParse = parseInt(form.telephone.slice(0,1));
        const areaCodeParse = parseInt(form.telephone.slice(1,4));
        const phoneNumberParse = parseInt(form.telephone.slice(4,11));

        const updateForm = {
          givenName: form.givenName,
          familyName: form.familyName,
          countryCode: countryCodeParse,
          areaCode: areaCodeParse,
          phoneNumber: phoneNumberParse,
          //email: form.email,
          altEmail: form.altEmail,}

        setLoadingButton(true);
        const {success} = await updateProfile(id, updateForm);
        if (success) {
          for (const [key, value] of Object.entries(updateForm)) {
            userContext[key] = value;
          }
          userContext.updateUser({
            //email: userContext.email,
            altEmail: userContext.altEmail,
            givenName: userContext.givenName,
            familyName: userContext.familyName,
            countryCode: userContext.countryCode,
            areaCode: userContext.areaCode,
            phoneNumber: userContext.phoneNumber,
          });
          // setLoadingButton(false);
          // history.push('/profile/' + id + '/');
        }
      } else {
        const phone = form.telephone.split(' ');
        const countryCodeParse = parseInt(phone[0]);
        const areaCodeParse = parseInt(phone[1].slice(1,4));
        const phoneNumberParse = parseInt(phone[2].slice(0,3) + phone[2].slice(4,8));
        const updateForm = {
          givenName: form.givenName,
          familyName: form.familyName,
          countryCode: countryCodeParse,
          areaCode: areaCodeParse,
          phoneNumber: phoneNumberParse,
          //email: form.email,
          altEmail: form.altEmail,}

        setLoadingButton(true);
        const {success} = await updateProfile(id, updateForm);
        if (success) {
          for (const [key, value] of Object.entries(updateForm)){
            userContext[key] = value;}

          userContext.updateUser({
            //email: userContext.email,
            altEmail: userContext.altEmail,
            givenName: userContext.givenName,
            familyName: userContext.familyName,
            countryCode: userContext.countryCode,
            areaCode: userContext.areaCode,
            phoneNumber: userContext.phoneNumber,
          });
          // setLoadingButton(false);
          // setDialogSubmit(false);
          // history.push('/profile/' + id + '/');
        }
      }
      setLoadingButton(false);
      setDialogSubmit(false);
      if (emailSent) {
        setDialogEmail(true);
      } else {
        history.push('/profile/' + id + '/');
      }


    } catch (e) {
      setLoadingButton(false);
      console.log('catch e')
      console.log( e.json);
    }
  };


  // OnBlur handler, called when user's focus moves from a field.
  const handleOnBlur = (e, field, option) => {
    if (!isFieldEmpty(form[field]) && option.validator && !!option.validator(form[field])){
      // state.errors.field = option.validator(e.target.value)
      setErrors({...errors, [field]: option.validator(form[field])});

    } else {
      setErrors({...errors, [field]: undefined});
    }
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
              onBlur={e => handleOnBlur(e, field, option)}
              error={!!errors[field]}
              helperText={errors[field]}
            />)

        })}

        {/* Button for submitting account info changes */}
        <Button variant="contained" color="primary" className={classes.button}
                onClick={handleCancel}>
          Cancel Changes
        </Button>

        <Button variant="contained" color="primary" className={classes.button}
                onClick={handleSubmitChanges}>
          Submit Changes
        </Button>


        {/* Alert prompt for submitting changes */}
        <AlertDialog
          dialogContentText={"Note that if you want to change your primary email, you will receive a " +
            "confirmation link in your input email. Changes of primary Email will only be made" +
            " after you click the confirm link in the email."}
          dialogTitle={'Are you sure to submit?'}
          buttons={[
            <Button onClick={() => setDialogSubmit(false)} key={'cancel'}>{'cancel'}</Button>,
            //<Button onClick={handleDialogConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>,
            <LoadingButton noDefaultStyle variant="text" color="primary" loading ={loadingButton} key={'confirm'}
                           onClick={handleDialogConfirm} children='confirm' autoFocus/>]}
          open={dialogSubmit}/>

        <AlertDialog
          dialogContentText={"The Link to confirm changes of primary Email has been sent."}
          dialogTitle={'Congratulation!'}
          buttons={<Button onClick={handleDialogEmail} key={'confirm'} autoFocus> {'confirm'}</Button>}
          open={dialogEmail}/>

      </div>


    </Container>
  )
}