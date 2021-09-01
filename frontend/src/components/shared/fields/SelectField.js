import React, { useCallback, useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@material-ui/core";
import makeStyles from '@material-ui/styles/makeStyles';

import { UN_SET } from '../../../constants';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: '16px 0 0',
    minWidth: 350,
  },
}));

/**
 *
 * @param label
 * @param InputLabelProps
 * @param className
 * @param options
 * @param noDefaultStyle
 * @param noEmpty
 * @param controlled {boolean=false} - Controlled by the parent component.
 *                                     Set it to true if you dynamically update options
 * @param defaultOptionTitle
 * @param onChange
 * @param formControlProps
 * @param helperText
 * @returns {*}
 * @constructor
 */
export default function SelectField({
                                      label, InputLabelProps, className, options, noDefaultStyle, noEmpty, controlled,
                                      defaultOptionTitle = 'Not Set', onChange, formControlProps, helperText, ...props
                                    }) {
  const classes = useStyles();
  const [value, setValue] = useState(noEmpty ? '' : UN_SET);
  const handleChange = useCallback(e => {
    const val = e.target.value;
    setValue(val);
    onChange({target: {value: val === UN_SET ? undefined : val}});
  }, [onChange]);

  useEffect(() => {
    setValue(props.value === undefined ? UN_SET : props.value);
  }, [props.value]);

  return (
    <div>
      <FormControl className={(noDefaultStyle || className) ? className : classes.formControl}
                   error={props.error}
                   required={props.required}
                   {...formControlProps}>
        {label && <InputLabel {...InputLabelProps}>{label}</InputLabel>}
        <Select
          margin="none"
          label={label}
          {...props}
          value={controlled ? props.value : value}
          onChange={controlled ? onChange : handleChange}
        >
          {!noEmpty && <MenuItem key="key0" value={UN_SET}>{defaultOptionTitle}</MenuItem>}
          {Array.isArray(options)
            ? options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)
            : Object.entries(options).map(([key, value]) => <MenuItem key={key} value={key}>{value}</MenuItem>)}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
