import React from "react";
import makeStyles from '@material-ui/styles/makeStyles';
import { Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 16,
  },
  paper: {
    display: 'inline-block',
    position: 'relative',
    paddingLeft: 28,
    paddingBottom: 20,
    minWidth: 380,
  }
}));

export default function ({label, children}) {
  const classes = useStyles();
  return (
    <div className={label && classes.root}>
      {label && <Typography color="textSecondary" variant="body1" gutterBottom>
        {label}
      </Typography>}
      <Paper variant="outlined" className={classes.paper}>
        {children}
      </Paper>
    </div>
  )
}
