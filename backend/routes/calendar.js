const express = require('express');
const {fetchAppointment} = require("../services/calendar");
const router = express.Router();

router.post('/calendar', fetchAppointment);

module.exports = router;
