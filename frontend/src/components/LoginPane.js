import React, { useContext, useState } from 'react'
import { useHistory } from "react-router";

import { TextField, Container, Paper, Typography, Button, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from './shared';

import { login } from '../api/auth';
import { UserContext } from "../context";

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 80,
    maxWidth: '500px'
  },
  paper: {
    padding: 30,
  },
  item: {
    marginTop: 20,
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
  },
  link: {
    marginTop: 10,
    color: '#007dff',
  }
}));

function LoginPane() {
  const classes = useStyles();
  const history = useHistory();
  const userContext = useContext(UserContext);
  const [form, setForm] = useState({email: '', password: '', alert: ''});

  const onChange = name => e => {
    const value = e.target.value;
    setForm(prev => ({...prev, [name]: value}));
  };

  const submit = async () => {
    try {
      const {success, data} = await login(form.email, form.password);
      console.log(form.email, form.password, success, data)
      if (success) {
        userContext.updateUser({
          id: data._id,
          isAdmin: data.role === 'admin',
          email: data.primaryEmail,
          altEmail: data.secondaryEmail,
          displayName: data.displayName,
          givenName: data.primaryContact?.givenName,
          familyName: data.primaryContact?.familyName,
          countryCode: data.primaryContact?.telephone?.countryCode,
          areaCode: data.primaryContact?.telephone?.areaCode,
          phoneNumber: data.primaryContact?.telephone?.phoneNumber,
        });
        console.log(userContext);
        history.push('/dashboard');
      }
    } catch (e) {
      console.error(e)
      setForm(prev => ({...prev, alert: e.json.message}));
    }
  };

  const onKeyPress = event => {
    if (event.key === "Enter") {
      submit();
    }
  };

  return (
    <Container className={classes.container} onKeyPress={onKeyPress}>
      <Paper elevation={5} className={classes.paper}>
        <Typography variant="h6">
          Sign in
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          type="email"
          value={form.email}
          onChange={onChange('email')}
          className={classes.item}
        />
        <br/>
        <TextField
          fullWidth
          variant="outlined"
          label="Password"
          type="password"
          value={form.password}
          onChange={onChange('password')}
          className={classes.item}
        />
        <br/>
        <Typography variant="caption">
          <span style={{color: 'red'}}>{form.alert}</span>
        </Typography>
        <br/>
        <Button variant="outlined" color="primary" className={classes.button} onClick={submit}> Log in</Button>
        <Divider/>
        <Link to={'/login-pane'}>
          <Typography variant="body2" className={classes.link}>
            Don't have an account?
          </Typography>
        </Link>

        <Link to={'/email-confirm'}>
          <Typography variant="body2" className={classes.link}>
            Forget password?
          </Typography>
        </Link>
      </Paper>
    </Container>
  );
}

export default LoginPane;
