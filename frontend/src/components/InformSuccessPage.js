import * as React from 'react';
import {useState} from "react";
import {defaultInvitationFields} from "../constants/default_fields";
import {useHistory} from "react-router";
import {Container} from "@mui/material";

export default function InformSuccessPage() {
  const history = useHistory();


  setTimeout((()=>history.push('/')), 5000);



  return (
    <Container>
      <p>
        Success! You will be brought back to the main page in 5 seconds
      </p>

    </Container>)
}