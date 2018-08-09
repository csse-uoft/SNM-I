import React from 'react';
import _ from 'lodash';
import { Col, FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

export default function CheckboxField({ id, label, required, options, checkedOptions, onChange }) {
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
        {(options.constructor === Array) ? (
          <div>
            {options.map((option) => {
              return (
                <Checkbox
                  key={option}
                  value={option}
                  checked={_.includes(checkedOptions, option)}
                  onChange={e => onChange(e, id)}
                  inline
                >
                  {option}
                </Checkbox>
              )
            })}
          </div>
        ) : (
          <div>
            {_.map(options, (value, title) => {
              return (
                <Checkbox
                  key={value}
                  value={value}
                  checked={_.includes(checkedOptions, value)}
                  onChange={e => onChange(e, value)}
                  inline
                >
                  {title}
                </Checkbox>
              )
            })}
          </div>
        )}
      </Col>
    </FormGroup>
  );
}
