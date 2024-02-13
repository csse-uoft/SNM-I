const express = require('express');
const {fetchAppointment} = require("../services/calendar");
const router = express.Router();

router.post('/calendar/1', fetchAppointment);

module.exports = router;
