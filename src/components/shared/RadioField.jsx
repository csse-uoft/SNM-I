import React from 'react';
import _ from 'lodash';
import { Col, FormGroup, FormControl, ControlLabel, Radio } from 'react-bootstrap';

export default function RadioField({ id, label, required, options, defaultChecked, onChange }) {
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
        {_.map(options, (value, label) => {
          return (
            <Radio
              name={id}
              key={value}
              value={value}
              onChange={e => onChange(e, id, JSON.parse(value))}
              defaultChecked={defaultChecked === JSON.parse(value)}
              inline
            >
              {label}
            </Radio>
          )
        })}
      </Col>
    </FormGroup>
  );
}
