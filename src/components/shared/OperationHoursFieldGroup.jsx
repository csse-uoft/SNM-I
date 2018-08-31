import React from 'react';
import _ from 'lodash';
import GeneralField from './GeneralField';

export default function OperationHoursFieldGroup({ operationHours, handleFormValChange }) {
  return (
    <div>
      {_.map(operationHours, (operationHour, index) => {
        return (
          <div key={operationHour.week_day}>
            <h4>{operationHour.week_day}</h4>
            <GeneralField
              id="start_time"
              label="Start Time"
              type="text"
              value={operationHour.start_time}
              onChange={e => handleFormValChange(e, operationHour.week_day, index)}
            />
            <GeneralField
              id="end_time"
              label="End time"
              type="text"
              value={operationHour.end_time}
              onChange={e => handleFormValChange(e, operationHour.week_day, index)}
            />
          </div>
        )
      })}
    </div>
  );
}
