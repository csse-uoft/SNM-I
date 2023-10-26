const express = require('express');

const {matchFromClientHandler} = require("../services/matching");
const {getEligibilityConfigHandler} = require("../services/eligibility");
const router = express.Router();

router.get('/matching/client/:clientId', matchFromClientHandler);

router.get('/eligibility/config', getEligibilityConfigHandler)

module.exports = router;
