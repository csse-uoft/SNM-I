import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Stepper, Step, StepButton, Button, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  buttons: {
    width: '80%',
    margin: 'auto',
    paddingTop: 20,
    paddingBottom: 40,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  alert: {
    width: '80%',
    margin: 'auto',
  },
  title: {
    color: '#4b4b4b',
    width: '80%',
    margin: 'auto',
  }
}));

export default function FormStepper({stepNames, handleFinish, getStepContent, error, title}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStep = step => () => {
    setActiveStep(step);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (activeStep === stepNames.length - 1) {
      handleFinish();
      return;
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  return (
    <div>
      <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        {stepNames.map((label, index) => (
          <Step key={label}>
            <StepButton
              onClick={handleStep(index)}
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {title && <Typography color="textSecondary" variant="h6" className={classes.title}>
          {title}
        </Typography>}
        {error && error.map((err, index) =>
          <Alert key={index} className={classes.alert} severity="error">{err}</Alert>)}
        {getStepContent(activeStep)}
        <div className={classes.buttons}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.backButton}
          >
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            {activeStep === stepNames.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
