import React, { useCallback} from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function Dropdown(props) {
  // options is [value1, value2, ...]
  const {options, label, value, onChange, helperText} = props;

  const handleChange = useCallback((e, value) => {
    onChange({target: {value}});
  }, [onChange]);

  return (
    <Autocomplete
      sx={{mt: '16px'}}
      multiple
      options={options}
      onChange={handleChange}
      getOptionLabel={option => option}
      defaultValue={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{minWidth: 350}}
          fullWidth={false}
          helperText={helperText}
        />
      )}
    />
  )
}
