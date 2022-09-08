const express = require('express');
const {createSingleServiceProvider, fetchMultipleServiceProviders, fetchSingleServiceProvider} = require("../services/genericData/serviceProvider");
const router = express.Router();

router.post('/providers', createSingleServiceProvider);
router.get('/providers', fetchMultipleServiceProviders);
router.get('/providers/:id', fetchSingleServiceProvider)

module.exports = router;