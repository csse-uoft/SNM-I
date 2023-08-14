const express = require('express');

const programProvisionService = require("../services/programProvision");
const router = express.Router();

router.get('/needOccurrences/client/:client', programProvisionService.getClientNeedOccurrenceByClient);
router.get('/outcomeOccurrences/client/:client', programProvisionService.getClientOutcomeOccurrenceByClient);
router.get('/programOccurrences/program/:program', programProvisionService.getProgramOccurrenceByProgram);
router.get('/needSatisfiers/programOccurrence/:programOccurrence', programProvisionService.getNeedSatisfiersByProgramOccurrence);

// This is for program occurrence page
router.get('/needSatisfiers/program/:program', programProvisionService.getNeedSatisfiersByProgram);


module.exports = router;
