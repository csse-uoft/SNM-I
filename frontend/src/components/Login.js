import React from 'react'
import {Typography, Button, Container, Grid, Box} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from './shared';

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 80,
    maxWidth: '500px',
  },
  button: {
    width: 300,
  },
}));

function Login() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container direction="column" spacing={3} alignItems="center">
        <Grid item>
          <Typography variant="h5">
            Log in to your Dashboard
          </Typography>
        </Grid>
        <Grid item>
          <Link to={`/login-pane`}>
            <Button variant="outlined" className={classes.button}>
              Sign in with SNM account
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link to={`/login-pane`}>
            <Button color="primary" variant="outlined" className={classes.button}>
              Facebook
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link to={`/login-pane`}>
            <Button color="secondary" variant="outlined" className={classes.button}>
              Google
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
