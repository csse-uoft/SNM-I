const express = require('express');
const {fetchOrganization, updateOrganization} = require("../services/partnerNetwork");
const router = express.Router();
router.get('/partnerNetwork/:id', fetchOrganization);
router.put('/partnerNetwork/:id', updateOrganization);

module.exports = router;
