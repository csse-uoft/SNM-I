import { GoogleLogin } from '@react-oauth/google';
import {Button} from "@mui/material";
import { useGoogleLogin } from '@react-oauth/google';
import {fetchGoogleCalendarAppointments} from "../../api/calendarAPI";
import {useParams} from "react-router-dom";

const GoogleCalendarLogin = (props) => {
  const {id} = useParams();
  const userId = id;

  console.log("User ID: ", userId);

  const login =
    useGoogleLogin({
    onSuccess: async codeResponse => {
      // Insert user ID into the code response
      codeResponse.userId = userId;
      await fetchGoogleCalendarAppointments(codeResponse).then(response => {
        props.insertGoogleAppointments(response.data);
      });
    },
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