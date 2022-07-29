import React from 'react';

import GeneralField from './fields/GeneralField';
import SelectField from './fields/SelectField';
import RadioField from './fields/RadioField';
import CheckboxField from './fields/CheckboxField';
import MultiSelectField from './fields/MultiSelectField';
import LocationFieldGroup from "./LocationFieldGroup";
import { objectFlip } from "../../helpers";

export default function FieldGroup({component, options, value, ...props}) {
  if (component === 'GeneralField' || component === 'TextField') {
    return (
      <GeneralField
        {...props}
        value={value}
      />
    );
  } else if (component === 'NumberField') {
    return (
      <GeneralField
        {...props}
        value={value}
        type="number"
      />
    );
  } else if (component === 'DateField') {
    return (
      <GeneralField
        {...props}
        value={value}
        type="date"
      />
    );
  } else if (component === 'DateField') {
    return (
      <GeneralField
        {...props}
        value={value}
        type="date"
      />
    );
  } else if (component === 'DateTimeField') {
    return (
      <GeneralField
        {...props}
        value={value}
        type="datetime"
      />
    );
  } else if (component === 'TimeField') {
    return (
      <GeneralField
        {...props}
        value={value}
        type="time"
      />
    );
  } else if (component === 'PhoneNumberField') {
    return (
      <GeneralField
        {...props}
        value={value}
        type="phoneNumber"
      />
    );
  } else if (component === 'AddressField') {
    return (
      <LocationFieldGroup {...props} address={value || {}}/>
    );
  } else if (component === 'SelectField' || component === 'SingleSelectField') {
    return (
      <SelectField
        options={options}
        {...props}
        value={value}
      />
    );
  } else if (component === 'MultiSelectField') {
    return (
      <MultiSelectField
        options={options}
        value={value}
        {...props}
      />
    );
  } else if (component === 'RadioSelectField') {
    return (
      <RadioField
        options={objectFlip(options)}
        value={value}
        {...props}
      />
    );
  } else if (component === 'RadioField') {
    return (
      <RadioField
        options={options}
        value={value}
        {...props}
      />
    );
  } else if (component === 'BooleanRadioField') {
    return (
      <RadioField
        {...props}
        options={{'Yes': true, 'No': false}}
        value={value}
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
