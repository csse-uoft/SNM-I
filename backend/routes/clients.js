const express = require('express');
const {createClientOrganization, fetchClientOrOrganization} = require("../services/client");
const router = express.Router();

router.post('/clientOrOrganization/:option/', createClientOrganization);
router.get('/clientOrOrganization/:option/:id', fetchClientOrOrganization);


module.exports = router;