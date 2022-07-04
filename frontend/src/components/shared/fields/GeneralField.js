import React, { useCallback, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import { TextField } from '@mui/material'
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';
import MuiPhoneNumber from "material-ui-phone-number";

export const dateFormat = 'yyyy-MM-dd';

export default function GeneralField({type, onChange, value: defaultValue, ...props}) {
  // duplicate the state, the drawback is much smaller than re-render all the form.
  const [value, setValue] = useState(() => {
    if (type === 'date') {
      if (defaultValue)
        return parse(defaultValue, dateFormat, new Date());
      else
        return null;
    }
    return defaultValue || '';
  });

  const handleChange = useCallback(e => {
    const val = e.target.value;
    setValue(val);
    onChange({target: {value: val}});
  }, [onChange, type]);


  const onChangeDate = date => {
    setValue(date);
    try {
      const formattedDate = format(date, dateFormat);
      onChange({target: {value: formattedDate}});
    } catch (e) {
      // Clear the date if the input is malformed
      onChange({target: {value: undefined}});
    }
  };

  if (type === 'date')
    return (
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={value}
            onChange={onChangeDate}
            onAccept={() => props.onBlur()}
            renderInput={(params) =>
              <TextField {...params}
                         sx={{minWidth: 350}}
                         margin="normal"
                         required={props.required}
                         error={params.error || props.error}
                         helperText={params.helperText || props.helperText}
                         onBlur={props.onBlur}
              />
            }
            {...props}
          />
        </LocalizationProvider>
      </div>
    );
  else if (type === 'phoneNumber')
    return (
      <div>
        <MuiPhoneNumber
          defaultCountry={'ca'}
          {...props}
          value={value}
          onChange={val => {
            onChange(val)
            setValue(val)
          }}
          // disableAreaCodes
          sx={{mt: '16px', minWidth: 350}}
          variant="outlined"
        />
      </div>
    );
  else
    return (
      <div>
        <TextField
          sx={{mt: '16px', minWidth: 350}}
          type={type}
          {...props}
          onChange={handleChange}
          value={value}
        />
      </div>
    );
}
