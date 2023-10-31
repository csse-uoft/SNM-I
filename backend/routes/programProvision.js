const express = require('express');

const programProvisionService = require("../services/programProvision");
const router = express.Router();

router.get('/programOccurrences/program/:program', programProvisionService.getProgramOccurrenceByProgram);
router.get('/needSatisfiers/programOccurrence/:programOccurrence', programProvisionService.getNeedSatisfiersByProgramOccurrence);

// This is for program occurrence page
router.get('/needSatisfiers/program/:program', programProvisionService.getNeedSatisfiersByProgram);


module.exports = router;
