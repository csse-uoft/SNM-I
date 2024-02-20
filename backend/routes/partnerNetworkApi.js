const express = require('express');
const {fetchOrganization, updateOrganization} = require("../services/partnerNetwork");
const {sendReferral} = require("../services/partnerNetwork/referrals");
const { sendAppointment } = require('../services/partnerNetwork/appointments');

const router = express.Router();

router.get('/partnerNetwork/:id', fetchOrganization);
router.put('/partnerNetwork/:id', updateOrganization);

router.post('/partnerNetwork/referral/:id?', sendReferral);
router.put('/partnerNetwork/referral/:id?', sendReferral);

router.post('/partnerNetwork/appointment/:id?', sendAppointment);
router.put('/partnerNetwork/appointment/:id?', sendAppointment);

module.exports = router;
