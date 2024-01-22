const express = require('express');
const {sendOrganization} = require("../services/partnerNetwork");
const {receiveReferral} = require("../services/partnerNetwork/referrals");
const { receivePartnerUpdateNotification } = require('../services/partnerNetwork/update');

const router = express.Router();

router.get('/partnerNetwork/organization/', sendOrganization);
router.post('/partnerNetwork/update/', receivePartnerUpdateNotification);

router.post('/partnerNetwork/referral/', receiveReferral);
router.put('/partnerNetwork/referral/', receiveReferral);

module.exports = router;
