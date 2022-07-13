import React, {useState} from 'react';
import {makeStyles} from "@mui/styles";
import {Button, Container, Typography} from "@mui/material";
import {useHistory, useParams} from "react-router";
import {verifyChangePrimaryEmail} from "../../api/userApi";
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

/**
 * This function is for user confirm primary Email change (accessed from link in email)
 * @returns {JSX.Element}
 */
export default function changePrimaryEmail() {
  const classes = useStyles();
  const {token} = useParams();
  const [dialogConfirmed, setDialogConfirmed] = useState(false);
  let history = useHistory();

  const handleCheck = async () => {
    try {
      const {success} = await verifyChangePrimaryEmail(token);
      if (success) {
        setDialogConfirmed(true);
      } else {
        console.log('change primary email failed.')
      }
    } catch (e) {
      console.log(e.json);
    }
  };

  const handleDialogConfirmed = () => {
    history.push('/login');
  }

  return (
    <Container className={classes.root}>
            <Typography variant="h5" >
              {'Please click the button below to confirm your changes of email.'}
            </Typography>

            <Button variant="contained" color="primary" className={classes.button} onClick={handleCheck}>
              Confirm Changes
            </Button>

            <AlertDialog
              dialogContentText={"You have successfully changed your primary Email. Click the confirm " +
                "button below to be redirected to the login page."}
              dialogTitle={'Congratulation!'}
              buttons={<Button onClick={handleDialogConfirmed} key={'redirect'} autoFocus> {'confirm'}</Button>}
              open={dialogConfirmed}/>

          </Container>
  )

}