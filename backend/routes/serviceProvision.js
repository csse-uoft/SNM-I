const express = require('express');

const serviceProvisionService = require("../services/serviceProvision");
const router = express.Router();

router.get('/needOccurrences/client/:client', serviceProvisionService.getClientNeedOccurrenceByClient);
router.get('/serviceOccurrences/service/:service', serviceProvisionService.getServiceOccurrenceByService);
router.get('/needSatisfiers/serviceOccurrence/:serviceOccurrence', serviceProvisionService.getNeedSatisfiersByServiceOccurrence);

// This is for service occurrence page
router.get('/needSatisfiers/service/:service', serviceProvisionService.getNeedSatisfiersByService);


module.exports = router;