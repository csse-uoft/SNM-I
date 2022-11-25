import React, {useCallback, useEffect, useState} from 'react';
import {Autocomplete, TextField} from "@mui/material";

export default function SelectField(props) {
  // options is {labelValue1: label1, labelValue2: label2, ...}
  let {options, label, value, onChange, helperText, required, error, onBlur, fullWidth, noDefaultStyle, controlled} = props;

  if (Array.isArray(options)) {
    const optionsArray = [...options];
    options = {};
    for (const optionValue of optionsArray) {
      options[optionValue] = optionValue;
    }
  }

  const handleChange = useCallback((e, value) => {
    onChange({target: {value}});
  }, [onChange]);

  return (
    <Autocomplete
      sx={noDefaultStyle ? undefined : {mt: '16px'}}
      options={Object.keys(options)}
      onChange={handleChange}
      getOptionLabel={labelValue => options[labelValue]}
      defaultValue={controlled ? undefined : value}
      value={controlled ? value : undefined}
      onBlur={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth={fullWidth || false}
          required={required}
          label={label}
          sx={noDefaultStyle ? undefined : {minWidth: 350}}
          helperText={helperText}
          error={error}
        />
      )}
    />
  )
}
