import { GoogleLogin } from '@react-oauth/google';
import {Button} from "@mui/material";
import { useGoogleLogin } from '@react-oauth/google';
import {useEffect, useState} from "react";
import {fetchGoogleCalendarAppointments} from "../../api/calendarAPI";

const GoogleCalendarLogin = (props) => {

  const login =
    useGoogleLogin({
    onSuccess: async codeResponse =>
      await fetchGoogleCalendarAppointments(codeResponse).then(response => {
        props.insertGoogleAppointments(response.data);
      }),
    flow: 'auth-code'
  });

  const authenticate = async () => {
    await login();
  }


  return (
    <div>
      <Button onClick={authenticate}>Authenticate with Google Calendar</Button>

    </div>
  );
}

export default GoogleCalendarLogin;