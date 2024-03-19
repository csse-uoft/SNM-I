const express = require('express');
const {fetchAppointment} = require("../services/calendar");
const {fetchGoogleAppointments} = require("../services/calendar/googleCalendar");
const router = express.Router();

router.post('/calendar', fetchAppointment);

router.post('/calendar_google', fetchGoogleAppointments);

module.exports = router;
