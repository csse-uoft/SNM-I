import { Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import clsx from "clsx";


const useStyles = makeStyles(theme => ({
  wrapper: {
    // margin: theme.spacing(1),
    position: 'relative',
    display: 'initial',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  button: {
    backgroundColor: '#3b924a',
    '&:hover': {
      backgroundColor: '#219d3a',
    },
    '&:active': {
      backgroundColor: '#3b924a',
    },
  }
}));


export default function LoadingButton({loading, className, children, noDefaultStyle, ...props}) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Button variant="contained"
              disabled={loading}
              className={noDefaultStyle ? className : clsx(classes.button, className)}
              {...props}>
        {children ? children : "Submit"}
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
    </div>
  )
}