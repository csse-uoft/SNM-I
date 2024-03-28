const express = require('express');
const {fetchAppointment} = require("../services/calendar");
const {fetchGoogleAppointments, storeGoogleAppointments, GoogleLogin, updateGoogleLogin} = require("../services/calendar/googleCalendar");
const router = express.Router();

router.post('/calendar', fetchAppointment);

router.post('/calendar_google_login', updateGoogleLogin)

router.post('/calendar_google', fetchGoogleAppointments);

router.put('/calendar_google', storeGoogleAppointments);

module.exports = router;
