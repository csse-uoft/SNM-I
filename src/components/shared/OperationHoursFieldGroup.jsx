import React from 'react';
import _ from 'lodash';
import GeneralField from './GeneralField';
import Select from 'react-select';
import { operationHourOptions, operationHourMapping } from '../../helpers/operation_hour_helpers'

import '../../stylesheets/OperationHour.scss';
import { Button, Col, Row, Glyphicon } from 'react-bootstrap';

export default function OperationHoursFieldGroup({ operationHours,
                                                   handleFormValChange,
                                                   handleOperationHourOnClick }) {
  return (
    <div className="operation-hour-fields">
      {_.map(operationHours, (timeSlots, weekDay) => {
        return (
          <div key={weekDay}>
            <div className="weekday">
              <h5>{weekDay}</h5>
            </div>
            <div className="operation-hours">
              {_.map(timeSlots, (time, idx) => {
                return (
                  <div
                    key={weekDay + idx}
                    className="operation-hour"
                  >
                    <div className="start-time">
                      <Select
                        value={operationHourMapping[time.start_time]
                          ? {value: time.start_time, label: operationHourMapping[time.start_time]}
                          : ''
                        }
                        placeholder="Time"
                        options={operationHourOptions}
                        onChange={e => handleFormValChange(e, weekDay, idx, 'start_time', 'change')}
                        components={
                          {
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null
                          }
                        }
                        isClearable
                        isSearchable
                      />
                    </div>
                    {' - '}
                    <div className="end-time">
                      <Select
                        value={operationHourMapping[time.end_time]
                          ? {value: time.end_time, label: operationHourMapping[time.end_time]}
                          : ''
                        }
                        placeholder="Time"
                        options={operationHourOptions}
                        onChange={e => handleFormValChange(e, weekDay, idx, 'end_time')}
                        components={
                          {
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null
                          }
                        }
                        isClearable
                        isSearchable
                      />
                    </div>
                    {' '}
                    {idx === (timeSlots.length - 1) &&
                      <Button
                        bsSize="small"
                        onClick={e => handleOperationHourOnClick(e, weekDay, 'add')}
                      >
                        <Glyphicon glyph="plus" />
                      </Button>
                    }
                    {' '}
                    {idx != 0 && idx === (timeSlots.length - 1) &&
                      <Button
                        bsStyle="danger"
                        bsSize="small"
                        onClick={e => handleOperationHourOnClick(e, weekDay, 'remove')}
                      >
                        <Glyphicon glyph="remove" />
                      </Button>
                    }
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  );
}
