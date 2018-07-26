import React from 'react';
import { Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default function SelectField({ id, label, required, options, ...props }) {
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
        <FormControl {...props}>
          <option value="select">--- Not Set ---</option>
          {options.map(option =>
            <option key={option} value={option}>{option}</option>
          )}
        </FormControl>
      </Col>
    </FormGroup>
  );
}
