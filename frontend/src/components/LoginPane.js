import React, { useState } from 'react'
import { useHistory } from "react-router";

import { TextField, Container, Paper, Typography, Button, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from './shared';

import { login, LOGIN_SUCCESS } from '../store/actions/authAction';
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  const [form, setForm] = useState({username: '', password: '', alert: ''});

  const onChange = name => e => {
    const value = e.target.value;
    setForm(prev => ({...prev, [name]: value}));
  };

  const submit = async () => {
    const {status, message} = await dispatch(login(form));
    if (status === LOGIN_SUCCESS) {
      history.push('/dashboard');
    } else {
      setForm(prev => ({...prev, alert: message}));
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
          label="Username"
          type="text"
          value={form.username}
          onChange={onChange('username')}
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

        <Link to={'/login-pane'}>
          <Typography variant="body2" className={classes.link}>
            Forget password?
          </Typography>
        </Link>
      </Paper>
    </Container>
  );
}

export default LoginPane;
