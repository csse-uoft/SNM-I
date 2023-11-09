const express = require('express');
const {refreshOrganization} = require("../services/partnerNetwork");
const router = express.Router();
router.get('/partnerNetwork/:id', refreshOrganization);

module.exports = router;
