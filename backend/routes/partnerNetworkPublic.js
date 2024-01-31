const express = require('express');
const {sendOrganization} = require("../services/partnerNetwork");
const {receiveReferral} = require("../services/partnerNetwork/referrals");
const { receiveAppointment } = require('../services/partnerNetwork/appointments');
const router = express.Router();
router.get('/partnerNetwork/organization/', sendOrganization);

router.post('/partnerNetwork/referral/', receiveReferral);
router.put('/partnerNetwork/referral/', receiveReferral);

router.post('/partnerNetwork/appointment/', receiveAppointment);
router.put('/partnerNetwork/appointment/', receiveAppointment);

module.exports = router;
