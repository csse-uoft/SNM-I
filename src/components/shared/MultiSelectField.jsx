import _ from 'lodash';
import React from 'react';
import Select from 'react-select';

import { Col, FormGroup, ControlLabel } from 'react-bootstrap';

export default function MultiSelectField({ id,
                                           label,
                                           required,
                                           options,
                                           defaultOptionTitle,
                                           onChange,
                                           value }) {
  if (value && value.length > 0) {
    if (value.constructor === Array) {
      value = _.map(value, option => { return { value: option, label: option } })
    } else {
      value = { value: value, label: value }
    }
  }

  if (options.constructor === Array) {
    options = _.map(options, option => { return { value: option, label: option } })
  }
  else {
    options = _.map(options, (label, value) => { return { value: value, label: label } })
  }
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
        <Select
          value={value}
          placeholder={`--- ${defaultOptionTitle || 'Not Set'} ---`}
          options={options}
          isClearable={true}
          isMulti={true}
          onChange={(option, actionMeta) => onChange(id, option, actionMeta)}
        />
      </Col>
    </FormGroup>
  );
}
