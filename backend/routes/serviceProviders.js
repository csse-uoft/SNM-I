const express = require('express');
const {createSingleServiceProvider, fetchMultipleServiceProviders, fetchSingleServiceProvider,
  deleteSingleServiceProvider, updateServiceProvider, searchMultipleServiceProviders
} = require("../services/genericData/serviceProvider");
const router = express.Router();

router.post('/providers', createSingleServiceProvider);
router.get('/providers', fetchMultipleServiceProviders);
router.get('/providers/search', searchMultipleServiceProviders);
router.get('/providers/:id', fetchSingleServiceProvider);
router.delete('/providers/:id', deleteSingleServiceProvider);
router.put('/providers/:id', updateServiceProvider);


module.exports = router;