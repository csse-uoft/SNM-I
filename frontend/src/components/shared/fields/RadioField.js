import React, { useCallback, useState } from 'react';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { UN_SET } from '../../../constants';

const useStyles = makeStyles(theme => ({
  formControl: {
    position: 'relative',
    top: 16,
  },
  formControlRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelRow: {
    width: 200,
    marginRight: 20,
  }
}));

const tryCastBool = val => val === 'true' ? true : (val === 'false' ? false : val);

export default function RadioField({
                                     row, disabled,
                                     noStar,
                                     label,
                                     required,
                                     options,
                                     onChange,
                                     value: parentValue = UN_SET,
                                     helperText,
                                     ...props
                                   }) {
  const classes = useStyles();
  const [value, setValue] = useState(parentValue);

  const handleChange = useCallback(e => {
    const val = tryCastBool(e.target.value);
    setValue(val);
    onChange({target: {value: val === UN_SET ? null : val}});
  }, [onChange]);

  return (
    <div>
      <FormControl className={row ? classes.formControlRow : classes.formControl} error={props.error} sx={{mb: '16px'}}>
        <FormLabel className={row && classes.labelRow} required={required && !noStar}
                   component="legend">{label}</FormLabel>
        <RadioGroup value={value} onChange={handleChange} row>
          {/*{!required && <FormControlLabel*/}
          {/*  key={UN_SET}*/}
          {/*  value={UN_SET}*/}
          {/*  control={<Radio color="primary"/>}*/}
          {/*  label={'N/A'}*/}
          {/*  labelPlacement="end"*/}
          {/*/>}*/}
          {Object.entries(options).map((([label, value]) =>
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio color="primary"/>}
                label={label}
                labelPlacement="end"
                disabled={disabled}
              />
          ))}
        </RadioGroup>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
