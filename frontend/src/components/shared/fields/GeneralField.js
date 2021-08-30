import React, { useCallback, useState } from 'react';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { format, parse } from 'date-fns';
import { TextField } from '@material-ui/core'
import makeStyles from '@material-ui/styles/makeStyles';
import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
} from '@material-ui/lab';

export const dateFormat = 'yyyy-MM-dd';

const useStyles = makeStyles(theme => ({
  textField: {
    // margin: theme.spacing(1),
    minWidth: 350,
  },
  formControl: {
    position: 'relative',
    top: 16,
  }
}));

export default function GeneralField({type, onChange, ...props}) {
  const classes = useStyles();
  // duplicate the state, the drawback is much smaller than re-render all the form.
  const [value, setValue] = useState(() => {
    if (type === 'date') {
      if (props.value)
        return parse(props.value, dateFormat, new Date());
      else
        return null;
    }
    return props.value || '';
  });

  const handleChange = useCallback(e => {
    const val = e.target.value;
    setValue(val);
    onChange({target: {value: type === 'date' ? format(val, dateFormat) : val}});
  }, [onChange, type]);

  const onChangeDate = date => {
    setValue(date);
    try {
      onChange({target: {value: format(date, dateFormat)}})
    } catch (e) {
    }
  };

  if (type === 'date')
    return (
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={value}
            inputFormat="yyyy-MM-dd"
            onChange={onChangeDate}
            renderInput={(params) =>
              <TextField {...params}
                         className={classes.textField}
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
            onChange={time => handleChange({target: {value: time}})}
            renderInput={(params) =>
              <TextField {...params}
                         className={classes.textField}
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
          InputLabelProps={{classes: {formControl: classes.formControl}}}
          className={classes.textField}
          // margin="dense"
          type={type}
          {...props}
          onChange={handleChange}
          value={value}
        />
      </div>
    );
}
