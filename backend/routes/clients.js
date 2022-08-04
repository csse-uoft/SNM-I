const express = require('express');
const {createClientOrganization, fetchClientOrOrganization, fetchClientsOrOrganizations} = require("../services/client");
const router = express.Router();

router.post('/clientOrOrganization/:option/', createClientOrganization);
router.get('/clientOrOrganization/:option/:id', fetchClientOrOrganization);
router.get('/clientOrOrganization/:option', fetchClientsOrOrganizations);

module.exports = router;