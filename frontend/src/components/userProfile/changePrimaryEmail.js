import React, {useState} from 'react';
import {makeStyles} from "@mui/styles";
import {Button, Container, Typography} from "@mui/material";
import {useParams} from "react-router";
import {verifyChangePrimaryEmail} from "../../api/userApi";


const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));


export default function changePrimaryEmail() {
  const classes = useStyles();
  const {token} = useParams();
  const [confirmed, setConfirmed] = useState(false);

  const handleCheck = async () => {
    try {
      console.log("reach before change email.")
      const {success} = await verifyChangePrimaryEmail(token);
      if (success) {
        console.log("change primary email success.")
        setConfirmed(true);
      } else {
        console.log('change primary email failed.')
      }
    } catch (e) {
      console.log(e.json);
    }

  };

  return (
    <Container className={classes.root}>
      {!confirmed ? (
        <Button variant="contained" color="primary" className={classes.button} onClick={handleCheck}>
          Confirm Changes
        </Button>
      ) : (
        <Typography variant="h4">
          {'Congratulations! You have successfully changed your primary Email. ' +
            'Please log in again for using your account.'}
        </Typography>
      )}
    </Container>
  )

}