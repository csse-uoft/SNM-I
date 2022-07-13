import {Container, Typography} from "@mui/material";
import React from "react";


export default function PasswordHint() {

  return (
    <Container>
      <Typography
        variant="body1" color={'navy'}
        style={{marginTop: '10px'}}>
        {'Your password must satisfy the following:'}
      </Typography>
      <Typography
        variant="body1" color={'primary'}
        style={{marginBottom: '5px'}}>
        {'- Contains at least 8 characters'}
      </Typography>
      <Typography
        variant="body1" color={'primary'}
        style={{marginBottom: '5px'}}>
        {'- Contains uppercase AND lowercase letters'}
      </Typography>

      <Typography
        variant="body1" color={'primary'}
        style={{marginBottom: '5px'}}>
        {'- Contains at least 1 number AND 1 special character'}
      </Typography>
    </Container>
  )
}