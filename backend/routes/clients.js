const express = require('express');
const {createClientOrganization} = require("../services/client");
const router = express.Router();

router.post('/clientOrOrganization/:option/', createClientOrganization);



module.exports = router;