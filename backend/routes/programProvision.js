const express = require('express');

const programProvisionService = require("../programs/programProvision");
const router = express.Router();

router.get('/needOccurrences/client/:client', programProvisionService.getClientNeedOccurrenceByClient);

module.exports = router;
