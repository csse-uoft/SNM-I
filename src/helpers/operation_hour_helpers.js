import _ from 'lodash';
import React from 'react';

export const defaultTimeSlot = {'start_time': '', 'end_time': ''};
export const defaultOperationHour = {
  'Monday': [{...defaultTimeSlot}],
  'Tuesday': [{...defaultTimeSlot}],
  'Wednesday': [{...defaultTimeSlot}],
  'Thursday': [{...defaultTimeSlot}],
  'Friday': [{...defaultTimeSlot}],
  'Saturday': [{...defaultTimeSlot}],
  'Sunday': [{...defaultTimeSlot}],
};

let mapping = {};
for (let hour = 1; hour <= 12; hour++) {
  const hourStringam = (hour / 10 < 1) ? '0' + hour : hour;
  for (let minutes = 0; minutes <= 45; minutes += 30) {
    const minuteString = (minutes === 0) ? '00' : minutes;
    const timeSlot = hourStringam + ':' + minuteString
    mapping[hour * 100 + minutes] = timeSlot + ' AM'
  }
}

for (let hour = 1; hour <= 12; hour++) {
  for (let minutes = 0; minutes <= 45; minutes += 30) {
    const hourStringpm = (hour / 10 < 1) ? '0' + hour : hour;
    const minuteString = (minutes === 0) ? '00' : minutes;
    const timeSlot = hourStringpm + ':' + minuteString;
    mapping[(hour + 12) * 100 + minutes] = timeSlot + ' PM'
  }
}

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

export function OperationHourTable({operationHourObj}) {
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
