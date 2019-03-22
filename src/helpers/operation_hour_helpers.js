import _ from 'lodash';
import React from 'react';
import { Table } from 'react-bootstrap';

export const defaultTimeSlot = { 'start_time': '', 'end_time': '' }
export const defaultOperationHour = {
  'Monday':    [_.clone(defaultTimeSlot)],
  'Tuesday':   [_.clone(defaultTimeSlot)],
  'Wednesday': [_.clone(defaultTimeSlot)],
  'Thursday':  [_.clone(defaultTimeSlot)],
  'Friday':    [_.clone(defaultTimeSlot)],
  'Saturday':  [_.clone(defaultTimeSlot)],
  'Sunday':    [_.clone(defaultTimeSlot)]
}

let options = [];
let mapping = {};
for (let hour = 1; hour <= 12; hour++) {
  const hourString = (hour / 10 < 1) ? '0' + String(hour) : String(hour)
  for (let minutes = 0; minutes <= 45; minutes += 30) {
    const minuteString = (minutes === 0) ? '00' : String(minutes)
    const timeSlot = hourString + ':' + minuteString
    options.push({
      value: hour * 100 + minutes,
      label: timeSlot + ' AM',
    })
    mapping[hour * 100 + minutes] = timeSlot + ' AM'
    options.push({
      value: (hour + 12) * 100  + minutes,
      label: timeSlot + ' PM',
    })
    mapping[(hour + 12) * 100  + minutes] = timeSlot + ' PM'
  }
}

export const operationHourOptions = options;
export const operationHourMapping = mapping;

export function operationHourListToObject(operation_hour_list) {
  let operation_hours = {}
  _.each(operation_hour_list, operation_hour => {
    const weekday = operation_hour['week_day']
    if (!operation_hours[weekday]) {
      operation_hours[weekday] = []
    }
    operation_hours[weekday].push({
      start_time: operation_hour['start_time'],
      end_time: operation_hour['end_time']
    })
  })
  return operation_hours
}

export function operationHourObjectToList(operation_hour_obj) {
  let operation_hours = []
  _.each(operation_hour_obj, (times, day) => {
    _.each(times, time => {
      operation_hours.push({
        week_day: day,
        start_time: time.start_time,
        end_time: time.end_time
      })
    })
  })
  return operation_hours
}

export function OperationHourTable({ operationHourObj }) {
  return (
    <table className="operation-hour-table">
      <tbody>
        {_.map(operationHourObj, (times, day) => {
          return (
            <tr key={day}>
              <td>{day}</td>
              <td>
                {_.map(times, (time, _) => {
                  return (
                    <div key={day + time.start_time}>
                      {`${operationHourMapping[time.start_time]} -
                        ${operationHourMapping[time.end_time]}`}
                    </div>
                  )
                })}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
