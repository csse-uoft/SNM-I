const express = require('express');
const {createSingleServiceProvider, fetchMultipleServiceProviders} = require("../services/genericData/serviceProvider");
const router = express.Router();

router.post('/providers', createSingleServiceProvider);
router.get('/providers', fetchMultipleServiceProviders);

module.exports = router;