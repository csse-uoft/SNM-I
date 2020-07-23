import React from 'react';

import GeneralField from './fields/GeneralField';
import SelectField from './fields/SelectField';
import RadioField from './fields/RadioField';
import CheckboxField from './fields/CheckboxField';
import MultiSelectField from './fields/MultiSelectField';

export default function FieldGroup({ component, options, value, ...props }) {
  if (component === 'GeneralField') {
    return (
      <GeneralField
        {...props}
        value={value}
      />
    );
  }
  else if (component === 'SelectField') {
    return (
      <SelectField
        options={options}
        {...props}
        value={value}
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
        value={value}
        {...props}
      />
    );
  }
  // return null;
  else if (component === 'CheckboxField') {
    return (
      <CheckboxField
        options={options}
        value={value}
        {...props}
      />
    );
  }
  return <div>Unknown field {component}</div>;
}
