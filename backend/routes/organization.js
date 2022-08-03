const express = require('express');
const {createUpdateOrganization} = require("../services/organization");
const router = express.Router();
//TODO: implement backend functions from ../services/organization

router.post('/organization', createUpdateOrganization);

module.exports = router;