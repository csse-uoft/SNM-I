import { GoogleLogin } from '@react-oauth/google';
import {Button} from "@mui/material";
import { useGoogleLogin } from '@react-oauth/google';
import {fetchGoogleCalendarAppointments, updateGoogleLogin} from "../../api/calendarAPI";
import {useParams} from "react-router-dom";

const GoogleCalendarLogin = (props) => {
  const {id} = useParams();
  const userId = id;

  const login =
    useGoogleLogin({
    onSuccess: async codeResponse => {
      // Insert user ID into the code response
      codeResponse.userId = userId;
      await updateGoogleLogin(codeResponse);
    },
    flow: 'auth-code',
      scope: ['https://www.googleapis.com/auth/calendar']
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