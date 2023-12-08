const express = require('express');
const {fetchOrganization, updateOrganization} = require("../services/partnerNetwork");
const {sendReferral} = require("../services/partnerNetwork/referrals");

const router = express.Router();

router.get('/partnerNetwork/:id', fetchOrganization);
router.put('/partnerNetwork/:id', updateOrganization);

router.post('/partnerNetwork/referral/:id?', sendReferral);

module.exports = router;
