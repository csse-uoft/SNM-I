import React, {useContext, useEffect, useState} from 'react';
// import Calendar from 'react-calendar';
import {fetchCalendarAppointments} from '../../api/calendarAPI';
import {useParams} from "react-router-dom";
import {UserContext} from "../../context";

import { Calendar, momentLocalizer  } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment-timezone';
import 'moment-timezone';
import {Box, Container, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import dayjs from 'dayjs';


function convertDate(date) {
  // Convert date to ISO string
  // Which has the format of "2024-02-22T00:00:00Z"
  return date.toISOString();
}

const PersonalCalendar = () => {
  // Requirements for the react-big-calendar
  const localizer = momentLocalizer(moment);

  // The variable to store the appointments that will be shown on the calendar
  const [appointments, setAppointments] = useState([]);

  // Local storage might store teh timezone, if so, use that, otherwise use the default timezone
  // This variable is used to initialize the timezone selector
  const initialTimeZone = localStorage.getItem('timezone') || 'Atlantic/Faeroe';
  const [selectedTimezone, setSelectedTimezone] = useState(initialTimeZone);


  // Other variables for indexing
  const {id} = useParams();


  // Fetch appointments from the API
  const fetchAppointments = async () => {
    // Fetch the appointments from the backend
    const data = await fetchCalendarAppointments({user_id: id});
    // For each of the appointments, convert the start and end date to a Date object that can be used by the react-big-calendar
    for (let i = 0; i < data.data.length; i++) {
      data.data[i].start = moment.tz(data.data[i].startDate, selectedTimezone).toDate();
      data.data[i].end = moment.tz(data.data[i].endDate, selectedTimezone).toDate();
      data.data[i].title = data.data[i].appointmentName;
    }
    // Set the appointments to the state
    setAppointments(data.data);
  };

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle the event click
  const handleEventClick = (event) => {
    // Get the event id
    let event_id = event._id;
    // Jump to the event page
    window.location.href = `/appointments/${event_id}`;
  }

  const handleTimeZoneChange = (event) => {
    setSelectedTimezone(event.target.value); // Set the selected timezone state
    moment.tz.setDefault(event.target.value); // Set the default timezone for moment
    localStorage.setItem('timezone', event.target.value) // Save the selected timezone to local storage
    // window.location.reload() // Reload the page to apply the timezone change

    // Additional note: big calendar have a bug that the timezone change will lose the event display for the last column if not reloaded
    // Therefore we need to reload the page to apply the timezone change
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [bigCalendarDate, setBigCalendarDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    // Update the state with the new selected date
    setSelectedDate(newDate);
    console.log("Selected Date: ", newDate.$d);
    setBigCalendarDate(newDate.$d);
  };



  return (
    <div>
      <FormControl size={"small"} >
        <InputLabel id="timezone-label">Time Zone</InputLabel>
        <Select
          labelId="timezone-label"
          id="timezone-select"
          value={selectedTimezone}
          label="Time Zone"
          onChange={handleTimeZoneChange}
        >
          {moment.tz.names().map((zone) => (
            <MenuItem key={zone} value={zone}>
              {zone}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <h2>Timezone: {selectedTimezone}</h2>

      <Box display={"flex"}>
        <Box flex={"1"}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => handleDateChange(newDate)}
            />
          </LocalizationProvider>
          {selectedDate !== null && (
            <p>Selected Date: {typeof selectedDate}</p>
            // You might need to format the date based on your requirements
          )}
        </Box>
        <Box display="flex" flex={"4"} justifyContent="center" alignItems="center">
          <Calendar
            localizer={localizer}
            events = {appointments}
            style={{height: 600, width: 1000}}
            onSelectEvent={event => handleEventClick(event)}
            date={bigCalendarDate}
            dayPropGetter={date => (moment(date).format('DD') === moment(bigCalendarDate).format('DD')) && ({ className: 'rbc-selected-day' })}
          />
        </Box>
      </Box>



    </div>
  );
};



export default PersonalCalendar;
