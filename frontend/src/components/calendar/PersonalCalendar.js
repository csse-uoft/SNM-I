import React, {useContext, useEffect, useState} from 'react';
// import Calendar from 'react-calendar';
import {
  fetchCalendarAppointments,
  fetchGoogleCalendarAppointments,
  storeGoogleCalendarAppointments
} from '../../api/calendarAPI';
import {useParams} from "react-router-dom";
import {UserContext} from "../../context";

import { Calendar, momentLocalizer  } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment-timezone';
import 'moment-timezone';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs
} from "@mui/material";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import dayjs from 'dayjs';
import GoogleCalendarLogin from "./GoogleCalendarLogin";
import Switch from "@mui/material/Switch";

// import {google} from 'googleapis';


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
  const [personal_appointments, setPersonalAppointments] = useState([]);
  const [google_appointments, setGoogleAppointments] = useState([]);

  // THE TIMEZONE PART

  // Local storage might store teh timezone, if so, use that, otherwise use the default timezone
  // This variable is used to initialize the timezone selector
  const initialTimeZone = localStorage.getItem('timezone') || 'Etc/GMT-4';
  const [selectedTimezone, setSelectedTimezone] = useState(initialTimeZone);

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



  // Other variables for indexing
  const {id} = useParams();


  // FETCH AND INSERT APPOINTMENTS
  const fetchPersonalAppointments = async () => {
    // Fetch the appointments from the backend
    const data = await fetchCalendarAppointments({user_id: id});
    // For each of the appointments, convert the start and end date to a Date object that can be used by the react-big-calendar
    for (let i = 0; i < data.data.length; i++) {
      data.data[i].start = moment.tz(data.data[i].startDate, selectedTimezone).toDate();
      data.data[i].end = moment.tz(data.data[i].endDate, selectedTimezone).toDate();
      data.data[i].title = data.data[i].appointmentName;
    }
    // Set the appointments to the state
    return data.data
  };

  // Fetch appointments when the component mounts
  useEffect(async () => {
    // fetch appointments when the appointments state is empty
    if (appointments.length === 0) {
      let local_appointments = await fetchPersonalAppointments();
      setPersonalAppointments(local_appointments);
    }
  }, []);

  const InsertGoogleAppointments = (newAppointments) => {
    // start with state appointments, then insert appointments in the new appointments one by one
    let newAppointmentsArray = [...appointments];
    for (let i = 0; i < newAppointments.length; i++) {
      let insertedAppointment = {};
      insertedAppointment.start = moment.tz(newAppointments[i].startDate, selectedTimezone).toDate();
      insertedAppointment.end = moment.tz(newAppointments[i].endDate, selectedTimezone).toDate();
      insertedAppointment.title = newAppointments[i].appointmentName;
      newAppointmentsArray.push(insertedAppointment);
    }

    // console.log("New Appointments Array: ", newAppointmentsArray);
    setGoogleAppointments(newAppointmentsArray);
  }

  const fetchGoogleAppointments = async () => {
    const response = await fetchGoogleCalendarAppointments({userId: id});
    InsertGoogleAppointments(response.data);
  }

  useEffect(async () => {
    await fetchGoogleAppointments();
  }, []);


  // HANDLE CHANGES
  const handlePersonalEventClick = (event) => {
    // Get the event id
    let event_id = event._id;
    // Jump to the event page
    window.location.href = `/appointments/${event_id}`;
  }

  // Google Calendar API


  const [calendarNumber, setCalendarNumber] = useState(1);
  const label = { inputProps: { 'aria-label': 'Size switch demo' } };


  return (
    <div>
      <Box display={"flex"}>
        <Box marginRight={2}>
          <FormControl size={"small"}>
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

        </Box>
        <Box marginRight={2}>
          <Button variant="outlined" onClick={() => window.location.href = `/appointments/new`} marginRight={2}>Create New Appointment</Button>
        </Box>

        <Box>
          <GoogleCalendarLogin insertGoogleAppointments={InsertGoogleAppointments}/>

        </Box>

        <FormGroup>
          <FormControlLabel control={
            <Switch {...label} defaultChecked onChange={() => setCalendarNumber(1 - calendarNumber)} />}
                            label="Local Calendar Or Google Calendar" />
        </FormGroup>

      </Box>


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
        </Box>
        <Box display="flex" flex={"4"} justifyContent="center" alignItems="center" flexDirection={"column"}>
          {calendarNumber === 0 &&
            <Calendar
              localizer={localizer}
              events = {personal_appointments}
              style={{height: 600, width: 1000}}
              onSelectEvent={event => handlePersonalEventClick(event)}
              date={bigCalendarDate}
              dayPropGetter={date => (moment(date).format('DD') === moment(bigCalendarDate).format('DD')) && ({ className: 'rbc-selected-day' })}
            />
          }
          {calendarNumber === 1 &&
            <Calendar
              localizer={localizer}
              events = {google_appointments}
              style={{height: 600, width: 1000}}
              onSelectEvent={event => handlePersonalEventClick(event)}
              date={bigCalendarDate}
              dayPropGetter={date => (moment(date).format('DD') === moment(bigCalendarDate).format('DD')) && ({ className: 'rbc-selected-day' })}
            />
          }

        </Box>
      </Box>



    </div>
  );
};



export default PersonalCalendar;
