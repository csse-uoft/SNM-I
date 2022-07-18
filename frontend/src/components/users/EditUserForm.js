import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { Button, Container, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  fetchUser,
  updateUser,
  createUser,
  getProfile,
  getUserProfileById,
  updatePrimaryEmail,
  updateProfile
} from "../../api/userApi";
import { Loading } from "../shared"
import { isFieldEmpty } from "../../helpers";
import {DUPLICATE_HELPER_TEXT, REQUIRED_HELPER_TEXT} from "../../constants";
import {userProfileFields} from "../../constants/userProfileFields";
import {formatPhoneNumber} from "../../helpers/phone_number_helpers";
import {AlertDialog} from "../shared/Dialogs";
import LoadingButton from "../shared/LoadingButton";

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

export default function EditUserForm() {
  const classes = useStyles();
  const history = useHistory();
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({});
  const [form, setForm] = useState({...userProfileFields});
  const [dialogSubmit, setDialogSubmit] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [dialogEmail, setDialogEmail] = useState(false);
  let emailSent = false;

  useEffect(() => {
    getUserProfileById(id).then(user => {
      setUser(user);
      setForm({
        givenName: (user.primaryContact && user.primaryContact.givenName) ?
          user.primaryContact.givenName : 'Not Provided',
        familyName: (user.primaryContact && user.primaryContact.familyName) ?
          user.primaryContact.familyName : 'Not Provided',
        email: user.primaryEmail,
        altEmail: !user.secondaryEmail ? 'Not Provided' : user.secondaryEmail,
        telephone: (user.primaryContact && user.primaryContact.telephone) ?
          formatPhoneNumber(user.primaryContact.telephone) : 'Not Provided'
      })
      setLoading(false);
    });
  }, [id]);

  console.log(user)


  /**
   * @returns {boolean} true if valid.
   */
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

  /**
   * handler of onBlur.
   * @param e
   * @param field
   * @param option
   */
  const handleOnBlur = (e, field, option) => {
    if (!isFieldEmpty(form[field]) && option.validator && !!option.validator(form[field])){
      setErrors({...errors, [field]: option.validator(form[field])});
    } else {
      setErrors({...errors, [field]: undefined});
    }
  };

  const handleCancel = () => {
    alert('All the changes you made will not be saved.');
    history.push('/profile/' + id);
  }

  // email-sent dialog confirm button handler
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
  
  };

  if (loading)
    return <Loading message={`Loading...`}/>;

  return (
    <Container className={classes.root}>
      <Typography variant="h5">
        {'Edit user'}
      </Typography>
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
          />)})}

      {/* Button for cancelling account info changes */}
      <Button variant="contained" color="primary" className={classes.button}
              onClick={handleCancel} key={'Cancel Changes'}>
        Cancel Changes
      </Button>

      {/* Button for submitting account info changes */}
      <Button variant="contained" color="primary" className={classes.button}
              onClick={handleSubmitChanges} key={'Submit Changes'}>
        Submit Changes
      </Button>


      {/* Alert prompt for submitting changes */}
      <AlertDialog
        dialogContentText={"Note that if you want to change your primary email, you will receive a " +
          "confirmation link in your input email. Changes of primary email will only be made" +
          " after you click the confirm link in the email."}
        dialogTitle={'Are you sure you want to submit?'}
        buttons={[
          <Button onClick={() => setDialogSubmit(false)} key={'cancel'}>{'cancel'}</Button>,
          //<Button onClick={handleDialogConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>,
          <LoadingButton noDefaultStyle variant="text" color="primary" loading ={loadingButton} key={'confirm'}
                         onClick={handleDialogConfirm} children='confirm' autoFocus/>]}
        open={dialogSubmit}/>

      {/* Alert prompt after email was sent */}
      <AlertDialog
        dialogContentText={"A confirmation link has been sent to the new primary email address."}
        dialogTitle={'Congratulations!'}
        buttons={<Button onClick={handleDialogEmail} key={'confirm'} autoFocus> {'confirm'}</Button>}
        open={dialogEmail}/>
    </Container>
  )
}