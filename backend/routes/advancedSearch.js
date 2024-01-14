// This file is used for multiple uses.
// TODO: look up commenting styles for file headers.

const express = require('express');
const {fetchForAdvancedSearch, advancedSearchGeneric, fetchForServiceAdvancedSearch, fetchForProgramAdvancedSearch, fetchForServiceProviderAdvancedSearch} = require("../services/advancedSearch");
const router = express.Router();

// genericItemType: characteristic, question, ...
// genericType: client, organization, ...
router.post('/advancedSearch/service', fetchForServiceAdvancedSearch);
router.post('/advancedSearch/program', fetchForProgramAdvancedSearch);
router.post('/advancedSearch/serviceprovider', fetchForServiceProviderAdvancedSearch);


router.get('/advancedSearch/fetchForAdvancedSearch/:genericType/:genericItemType', fetchForAdvancedSearch);
router.put('/advancedSearch/:genericType/:genericItemType', advancedSearchGeneric);


module.exports = router;