import React, { useCallback} from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function Dropdown(props) {
  // options is {labelValue1: label1, labelValue2: label2, ...}
  const {options, label, value, onChange, helperText, required, error, onBlur} = props;

  const handleChange = useCallback((e, value) => {
    onChange({target: {value}});
  }, [onChange]);

  return (
    <Autocomplete
      sx={{mt: '16px'}}
      multiple
      options={Object.keys(options)}
      onChange={handleChange}
      getOptionLabel={ labelValue=> options[labelValue]}
      defaultValue={value}
      onBlur={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label}
          sx={{minWidth: 350}}
          fullWidth={false}
          helperText={helperText}
          error={error}
        />
      )}
    />
  )
}
