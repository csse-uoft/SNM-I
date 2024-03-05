const express = require('express');
const {sendOrganization} = require("../services/partnerNetwork");
const {receiveNewReferral, receiveUpdatedReferral} = require("../services/partnerNetwork/referrals");
const {receiveNewAppointment, receiveUpdatedAppointment} = require('../services/partnerNetwork/appointments');
const {receivePartnerUpdateNotification} = require('../services/partnerNetwork/update');

const router = express.Router();

router.get('/partnerNetwork/organization/', sendOrganization);
router.post('/partnerNetwork/update/', receivePartnerUpdateNotification);

router.post('/partnerNetwork/referral/', receiveNewReferral);
router.put('/partnerNetwork/referral/', receiveUpdatedReferral);

router.post('/partnerNetwork/appointment/', receiveNewAppointment);
router.put('/partnerNetwork/appointment/', receiveUpdatedAppointment);

module.exports = router;
