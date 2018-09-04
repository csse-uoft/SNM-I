import React from 'react';

import GeneralField from './GeneralField';
import SelectField from './SelectField';
import RadioField from './RadioField';
import CheckboxField from './CheckboxField';
import MultiSelectField from './MultiSelectField';

export default function FieldGroup({ component, options, value, ...props }) {
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
  else if (component === 'MultiSelectField') {
    return (
      <MultiSelectField
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
