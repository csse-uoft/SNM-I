import { GoogleLogin } from '@react-oauth/google';

const GoogleCalendarLogin = () => {
  return (
    <div>
      <GoogleLogin
        // clientId={"97097151571-5rej5u8kh24uanvm4q72jaqm9sf3v5mf.apps.googleusercontent.com"}
        onSuccess={(response) => {
          console.log(response);
        }}
        onFailure={(response) => {
          console.log(response);
        }}
        // cookiePolicy={'single_host_origin'}
        // isSignedIn={true}
      />
    </div>
  );
}

export default GoogleCalendarLogin;