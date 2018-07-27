import React from 'react';
import _ from 'lodash';
import { Col, FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

export default function CheckboxField({ id, label, required, options, checkedOptions, handleFormValChange }) {
  return (
    <FormGroup controlId={id}>
      <Col
        sm={3}
        className={required && "required"}
        componentClass={ControlLabel}
      >
        {label}
      </Col>
      <Col sm={9}>
        {options.map((option) => {
          return (
            <Checkbox
              key={option}
              value={option}
              checked={_.includes(checkedOptions, option)}
              onChange={e => handleFormValChange(e, id)}
              inline
            >
              {option}
            </Checkbox>
          )
        })}
      </Col>
    </FormGroup>
  );
}
