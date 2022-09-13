const express = require('express');
const {createSingleServiceProvider, fetchMultipleServiceProviders, fetchSingleServiceProvider,
  deleteSingleServiceProvider
} = require("../services/genericData/serviceProvider");
const router = express.Router();

router.post('/providers', createSingleServiceProvider);
router.get('/providers', fetchMultipleServiceProviders);
router.get('/providers/:id', fetchSingleServiceProvider)
router.delete('/providers/:id', deleteSingleServiceProvider)

module.exports = router;