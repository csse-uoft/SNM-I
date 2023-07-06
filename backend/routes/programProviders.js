const express = require('express');
const {createSingleProgramProvider, fetchMultipleProgramProviders, fetchSingleProgramProvider,
  deleteSingleProgramProvider, updateProgramProvider
} = require("../services/genericData/programProvider");
const router = express.Router();

router.post('/providers', createSingleProgramProvider);
router.get('/providers', fetchMultipleProgramProviders);
router.get('/providers/:id', fetchSingleProgramProvider);
router.delete('/providers/:id', deleteSingleProgramProvider);
router.put('/providers/:id', updateProgramProvider);

module.exports = router;
