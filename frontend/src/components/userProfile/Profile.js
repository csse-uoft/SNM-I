import React, {useEffect, useState, useContext} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {Box, Button, Container, Typography} from "@mui/material";
import {userProfileFields} from "../constants/userProfileFields";
import {getProfile} from "../api/userApi";
import {defaultUserFields} from "../constants/default_fields";
import {Link, Loading} from "./shared";
import {UserContext} from "../context";

/* Page for User Profile, functionalities including:
*   - Display account information
*   - Display primary/secondary email
*   - Enter reset password page
* */

function NavButton({to, text}) {
  return (
    <Link to={to}>
      <Button
        variant="contained"
        color="primary"
        style={{display: 'block', width: 'inherit', marginTop: '10px', marginBottom: '20px'}}>
        {text}
      </Button>
    </Link>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));

export default function Profile() {

  const classes = useStyles();
  const history = useHistory();
  const {id} = useParams();
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({...userProfileFields});


  const profileForm = {
    givenName: userContext.givenName,
    familyName: userContext.familyName,
    telephone: userContext.countryCode && ('+' + userContext.countryCode.toString() + ' (' +
      userContext.areaCode.toString() + ') ' + userContext.phoneNumber.toString()),
    email: userContext.email,
    altEmail: userContext.altEmail,
  }
  console.log(profileForm)

  useEffect(() => {
    getProfile(id).then(user => {
      setForm(profileForm);
      setLoading(false);
    });
  }, [id]);

  // Edit Profile button handler
  const handleEdit = () => {
    alert('You are about to edit the profile!');
    history.push('/profile/' + id + '/edit');
  }

  if (loading)
    return <Loading message={`Loading...`}/>;

  return (
    <Container className={classes.root}>
      <Typography variant="h4">
        {'User Profile'}
      </Typography>

      <div>
        <Box sx={{
          backgroundColor: 'transparent',
          width: 'max-content',
          paddingTop: 3,
          borderBlockColor: 'grey',
          borderRadius: 2
        }}>
          {/* account information display */}
          {Object.entries(userProfileFields).map(([field, option]) => {
            return (
              <div>
                <Typography
                  style={{padding: 10, fontSize: 'large'}}>
                  {option.label} : {form[field]}
                </Typography>
              </div>
            )
          })}
        </Box>

        {/* Button for password reset */}
        <Button variant="contained" color="primary" className={classes.button} onClick={handleEdit}>
          Edit Profile
        </Button>

        <Box sx={{
          backgroundColor: 'transparent',
          width: 'max-content',
          paddingTop: 3,
          borderBlockColor: 'grey',
          borderRadius: 2
        }}>
          <Typography variant="h6"
                      style={{marginTop: '10px'}}>
            {'Want to change your password? Click below:'}
          </Typography>

          {/* Button for password reset */}
          <NavButton to={'/users/reset-password/' + id}
                     text={'Reset Password'}/>
        </Box>
      </div>
    </Container>
  )
}