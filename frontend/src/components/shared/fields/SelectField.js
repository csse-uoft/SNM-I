import React, {useCallback} from 'react';
import {Autocomplete, TextField} from "@mui/material";

export default function SelectField(props) {
  // options is {labelValue1: label1, labelValue2: label2, ...}
  let {options, label, value, onChange, helperText, required, error, onBlur, fullWidth, noDefaultStyle, controlled, sx, ...others} = props;

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

  if (options == null || options == undefined){
    options = {}
  }


  return (
    <Autocomplete
      sx={noDefaultStyle ? sx : {mt: '16px', maxWidth: 350, ...sx}}
      options={Object.keys(options).sort((a, b) => options[a].localeCompare(options[b]))}
      onChange={handleChange}
      getOptionLabel={labelValue => options[labelValue]}
      defaultValue={controlled ? undefined : value}
      value={controlled ? value : undefined}
      onBlur={onBlur}
      {...others}
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
