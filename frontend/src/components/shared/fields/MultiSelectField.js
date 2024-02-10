import React, {useCallback, useRef} from "react";
import {Autocomplete, TextField} from "@mui/material";

export default function Dropdown(props) {
  // options is {labelValue1: label1, labelValue2: label2, ...}
  const {options, label, value, onChange, helperText, required, error, onBlur, fullWidth} = props;

  // Make sure we only take the first value and make it persistent.
  const valueRef = useRef(value);

  const handleChange = useCallback((e, value) => {
    onChange({target: {value}});
  }, [onChange]);

  return (
    <Autocomplete
      sx={{mt: '16px'}}
      multiple
      options={Object.keys(options)}
      onChange={handleChange}
      getOptionLabel={labelValue => options[labelValue]}
      defaultValue={valueRef.current}
      onBlur={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth={fullWidth || false}
          required={required}
          label={label}
          sx={{minWidth: 350}}
          helperText={helperText}
          error={error}
        />
      )}
    />
  )
}
