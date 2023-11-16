const express = require('express');
const {sendOrganization} = require("../services/partnerNetwork");
const router = express.Router();
router.get('/partnerNetwork/organization/:id', sendOrganization);

module.exports = router;
