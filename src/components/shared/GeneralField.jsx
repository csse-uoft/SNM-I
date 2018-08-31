import React from 'react';
import { Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default function GeneralField({ id, label, required, ...props }) {
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
        <FormControl {...props} />
      </Col>
    </FormGroup>
  );
}
