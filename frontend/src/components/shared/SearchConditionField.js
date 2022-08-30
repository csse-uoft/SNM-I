import React from 'react';

import GeneralField from './fields/GeneralField';
import SelectField from './fields/SelectField';
import RadioField from './fields/RadioField';
import CheckboxField from './fields/CheckboxField';
import MultiSelectField from './fields/MultiSelectField';
import { objectFlip } from "../../helpers";
import AddressField from "./AddressFieldField";
import {Grid} from "@mui/material";

export default function SearchConditionField({component, options, ...props}) {
  if (component === 'GeneralField' || component === 'TextField') {
    return (
      <GeneralField
        {...props}
      />
    );
  } else if (component === 'NumberField') {
    return (
      <Grid container>
        <GeneralField
          {...props}
          label="minimum"
          type="number"
        />
        <GeneralField
          {...props}
          label="maximum"
          type="number"
        />
      </Grid>
    );
  } else if (component === 'DateField') {
    return (
      <GeneralField
        {...props}
        type="date"
      />
    );
  } else if (component === 'DateTimeField') {
    return (
      <GeneralField
        {...props}
        type="datetime"
      />
    );
  } else if (component === 'TimeField') {
    return (
      <GeneralField
        {...props}
        type="time"
      />
    );
  } else if (component === 'PhoneNumberField') {
    return (
      <GeneralField
        {...props}
        type="phoneNumber"
      />
    );
  } else if (component === 'AddressField') {
    return (
      <AddressField {...props}/>
    );
  } else if (component === 'SelectField' || component === 'SingleSelectField') {
    return (
      <SelectField
        options={options}
        {...props}
        noEmpty
      />
    );
  } else if (component === 'MultiSelectField') {
    return (
      <MultiSelectField
        options={options}
        {...props}
      />
    );
  } else if (component === 'RadioSelectField') {
    return (
      <RadioField
        options={objectFlip(options)}
        {...props}
      />
    );
  } else if (component === 'RadioField') {
    return (
      <RadioField
        options={options}
        {...props}
      />
    );
  } else if (component === 'BooleanRadioField') {
    return (
      <RadioField
        {...props}
        options={{'Yes': true, 'No': false}}
      />
    );
  }
  // return null;
  else if (component === 'CheckboxField') {
    return (
      <CheckboxField
        options={options}
        {...props}
      />
    );
  }
  return <div>Unknown field {component}</div>;
}