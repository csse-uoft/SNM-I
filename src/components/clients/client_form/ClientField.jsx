import React from 'react';

import GeneralField from '../../shared/GeneralField';
import SelectField from '../../shared/SelectField';
import RadioField from '../../shared/RadioField';
import CheckboxField from '../../shared/CheckboxField';

export default function ClientField({ component, options, value, ...props }) {
  if (component === 'GeneralField') {
    return (
      <GeneralField
        value={value}
        {...props}
      />
    );
  }
  else if (component === 'SelectField') {
    return (
      <SelectField
        componentClass="select"
        options={options}
        value={value}
        {...props}
      />
    );
  }
  else if (component === 'RadioField') {
    return (
      <RadioField
        options={options}
        defaultChecked={value}
        {...props}
      />
    );
  }
  else if (component === 'CheckboxField') {
    return (
      <CheckboxField
        options={options}
        checkedOptions={value}
        {...props}
      />
    );
  }
}
