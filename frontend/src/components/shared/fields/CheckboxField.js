import React, { useCallback, useMemo, useState } from 'react';
import { FormLabel, FormControl, FormGroup, FormControlLabel, Checkbox, FormHelperText } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  formControl: {
    // position: 'relative',
    marginTop: 16,
    // marginBottom: 8,
  },
}));

export default function CheckboxField({label, required, options, onChange, helperText, ...props}) {
  const optionsArray = useMemo(() =>
    Array.isArray(options) ? options : Object.values(options), [options]);

  const [value, setValue] = useState(() => {
    const data = {};
    optionsArray.forEach(option => {
      data[option] = props.value.includes(option);
    });
    return data;
  });

  const handleChange = useCallback(name => e => {
    const checked = e.target.checked;
    const newValue = {
      ...value,
      [name]: checked
    };
    setValue(newValue);
    const parentValue = [];
    Object.entries(newValue).forEach(([name, checked]) => {
      if (checked) parentValue.push(name);
    });
    onChange({target: {value: parentValue}});
  }, [onChange, value]);

  const classes = useStyles();
  return (
    <FormControl component="fieldset" className={classes.formControl} error={props.error}>
      <FormLabel required={required} component="legend">{label}</FormLabel>
      <FormGroup row>
        {optionsArray.map(name =>
          <FormControlLabel
            key={name}
            label={name}
            control={<Checkbox color="primary" checked={value[name]} onChange={handleChange(name)}/>}
          />
        )}
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
