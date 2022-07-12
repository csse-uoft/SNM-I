import {Container, Typography} from "@mui/material";
import React from "react";


export default function PasswordHint() {

  return (
    <Container>
      <Typography
        variant="h6" color={'navy'}
        style={{marginTop: '10px'}}>
        {'Note that a strong and valid password should satisfy:'}
      </Typography>
      <Typography
        variant="body1" color={'primary'}
        style={{marginBottom: '5px'}}>
        {'- Contain at least 8 characters.'}
      </Typography>
      <Typography
        variant="body1" color={'primary'}
        style={{marginBottom: '5px'}}>
        {'- Contain upper case AND lower case letters.'}
      </Typography>

      <Typography
        variant="body1" color={'primary'}
        style={{marginBottom: '5px'}}>
        {'- Contain at least 1 number and at least 1 punctuation mark.'}
      </Typography>
    </Container>
  )
}