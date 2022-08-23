const express = require('express');
const {createOrganization} = require("../services/organization");
const router = express.Router();
//TODO: implement backend functions from ../services/organization

router.post('/organization', createOrganization);

module.exports = router;