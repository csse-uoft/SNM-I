import React, { useCallback, useState } from 'react';
import { format, parse } from 'date-fns';
import { TextField } from '@material-ui/core'
import makeStyles from '@material-ui/styles/makeStyles';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className={classes.textField}
            variant="inline"
            margin="normal"
            format="yyyy-MM-dd"
            placeholder={dateFormat}
            autoOk
            {...props}
            onChange={onChangeDate}
            value={value}
          />
        </MuiPickersUtilsProvider>
      </div>
    );
  else if (type === 'time')
    return (
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardTimePicker
            className={classes.textField}
            variant="inline"
            margin="normal"
            autoOk
            {...props}
            onChange={time => handleChange({target: {value: time}})}
            value={value}
          />
        </MuiPickersUtilsProvider>
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
