import React, { useCallback, useState } from 'react';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { format, parse } from 'date-fns';
import { TextField } from '@material-ui/core'
import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
} from '@material-ui/lab';

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
    return defaultValue|| '';
  });

  const handleChange = useCallback(e => {
    const val = e.target.value;
    setValue(val);
    onChange({target: {value: val}});
  }, [onChange, type]);

  const onChangeDate = date => {
    setValue(date);
  }

  const onAcceptDate = date => {
    setValue(date);
    const formattedDate = format(date, dateFormat);
    try {
      onChange({target: {value: formattedDate}});
    } catch (e) {
    }
  };

  if (type === 'date')
    return (
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={value}
            onAccept={onAcceptDate}
            onChange={onChangeDate}
            renderInput={(params) =>
              <TextField {...params}
                         sx={{minWidth: 350}}
                         margin="normal"/>
            }
            {...props}
          />
        </LocalizationProvider>
      </div>
    );
  else if (type === 'time')
    return (
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            value={value}
            onAccept={onAcceptDate}
            onChange={onChangeDate}
            renderInput={(params) =>
              <TextField {...params}
                         sx={{minWidth: 350}}
                         margin="normal"/>
            }
            {...props}
          />
        </LocalizationProvider>
      </div>);
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
