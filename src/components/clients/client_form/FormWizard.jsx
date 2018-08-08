import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

function wizardStepStyle(currentStep, wizardStep, totalStepCount) {
  const col = Math.floor(12 / totalStepCount)
  if (currentStep === wizardStep) {
    return `col-xs-${col} bs-wizard-step active`
  }
  else if (currentStep > wizardStep) {
    return `col-xs-${col} bs-wizard-step complete`
  }
  else {
    return `col-xs-${col} bs-wizard-step disabled`
  }
}

function WizardStep({ stepNumber, currentStep, handleStepClick, title, totalStepCount }) {
  return (
    <div className={wizardStepStyle(currentStep, stepNumber, totalStepCount)}>
      <div className="text-center bs-wizard-stepnum">Step {stepNumber}</div>
      <div className="progress"><div className="progress-bar"></div></div>
      <div className="bs-wizard-dot" onClick={e => handleStepClick(stepNumber)}></div>
      <div className="bs-wizard-info text-center">
        {title}
      </div>
    </div>
  );
}

export default function FormWizard({ stepTitles, currentStep, handleStepClick }) {
  return (
    <div className="row bs-wizard">
      {_.map(stepTitles, (title, index) => {
        const stepNumber = index + 1;
        return (
          <WizardStep
            key={stepNumber}
            stepNumber={stepNumber}
            currentStep={currentStep}
            handleStepClick={handleStepClick}
            title={title}
            totalStepCount={stepTitles.length}
          />
        )
      })}
    </div>
  );
}

FormWizard.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handleStepClick: PropTypes.func.isRequired,
};
