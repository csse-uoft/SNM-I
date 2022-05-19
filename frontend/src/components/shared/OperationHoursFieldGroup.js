import React, { useState } from 'react';
import { operationHourMapping, defaultTimeSlot } from '../../helpers/operation_hour_helpers'

import { IconButton, Typography, Grid, Alert } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { Delete, Add, ArrowRightAltOutlined as Arrow } from '@mui/icons-material';
import { FieldsWrapper } from "./index";
import SelectField from "./fields/SelectField";

import { format } from 'date-fns';
import GeneralField, {dateFormat} from './fields/GeneralField.js'

const useStyles = makeStyles(theme => ({
  weekday: {
    minWidth: 110,
    alignSelf: 'start',
    top: 28,
    position: 'relative',
  },
  day: {
    display: 'flex',
    alignItems: 'center',
  },
  times: {
    display: 'flex',
    minWidth: 350,
    alignItems: 'start',
    flexDirection: 'column'
  },
  date: {
    display: 'flex',
    width: 170,
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  select: {
    minWidth: 120,
    margin: 10,
  },
  button: {
    position: 'relative',
    top: 8,
  },
  arrow: {
    paddingTop: 24,
    marginLeft: 12,
    marginRight: 12
  }
}));

export default function OperationHoursFieldGroup({operationHours, operationDates, errMsg}) {
  const classes = useStyles();
  // console.log(operationHours)
  // A way to achieve forceUpdate()
  const [state, update] = useState(true);
  const forceUpdate = () => update(!state);

  const handleOperationHourOnClick = (e, weekDay, action) => {
    if (action === 'add') {
      operationHours[weekDay].push({...defaultTimeSlot})
    } else {
      operationHours[weekDay].pop()
    }
    forceUpdate();
  };

  const handleChange = (e, weekDay, slotIndex, id) => {
    const value = e.target.value;
    operationHours[weekDay][slotIndex][id] = value == null ? '' : value;
    forceUpdate();
  };

  return (
    <FieldsWrapper label="Availability">

      {operationDates.map(({start_date: startDate, end_date: endDate}, idx) => {
        // default is today
        if (startDate == null) startDate = operationDates[idx].start_date = format(new Date(), dateFormat);

        return (
          <Grid container direction="row" alignItems="center" key={idx}>
            <GeneralField
              label="Start Date"
              className={classes.date}
              type="date"
              value={startDate}
              onChange={e => operationDates[idx].start_date = e.target.value}
            />
            <Arrow className={classes.arrow}/>
            <GeneralField
              label="End Date"
              className={classes.date}
              type="date"
              value={endDate}
              onChange={e => operationDates[idx].end_date = e.target.value}
              helperText={"leave empty if not sure"}
            />
            {idx === (operationDates.length - 1) &&
            <IconButton
              className={classes.button}
              onClick={e => {
                operationDates.push({start_date: null, end_date: null});
                forceUpdate();
              }}
              size="large">
              <Add/>
            </IconButton>
            }
            {idx !== 0 && idx === (operationDates.length - 1) &&
            <IconButton
              className={classes.button}
              onClick={e => {
                operationDates.splice(idx, 1);
                forceUpdate();
              }}
              size="large">
              <Delete/>
            </IconButton>
            }
          </Grid>
        );
      })}


      {Object.entries(operationHours).map(([weekDay, timeSlots]) => {
        return (
          <div key={weekDay} className={classes.day}>
            <Typography color="textSecondary" variant="subtitle1" className={classes.weekday}>
              {weekDay}
            </Typography>
            <div className={classes.times}>
              {timeSlots.map((time, idx) => {
                return (
                  <div key={idx} className={classes.time}>
                    <SelectField
                      className={classes.select}
                      value={time.start_time}
                      label="Start"
                      options={operationHourMapping}
                      onChange={e => handleChange(e, weekDay, idx, 'start_time', 'change')}
                      // InputLabelProps={{ shrink: true }}
                      // variant="outlined"
                    />
                    <SelectField
                      className={classes.select}
                      value={time.end_time}
                      label="End"
                      options={operationHourMapping}
                      onChange={e => handleChange(e, weekDay, idx, 'end_time')}
                      // InputLabelProps={{ shrink: true }}
                    />
                    {idx === (timeSlots.length - 1) &&
                    <IconButton
                      className={classes.button}
                      onClick={e => handleOperationHourOnClick(e, weekDay, 'add')}
                      size="large">
                      <Add/>
                    </IconButton>
                    }
                    {idx !== 0 && idx === (timeSlots.length - 1) &&
                    <IconButton
                      className={classes.button}
                      onClick={e => handleOperationHourOnClick(e, weekDay, 'remove')}
                      size="large">
                      <Delete/>
                    </IconButton>
                    }
                  </div>
                );
              })}
            </div>

          </div>
        );
      })}
      {errMsg &&
      <Alert severity="error">{errMsg}</Alert>}
    </FieldsWrapper>
  );
}
