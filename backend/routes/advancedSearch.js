const express = require('express');
const {fetchForAdvancedSearch, advancedSearchGeneric} = require("../services/advancedSearch");

const router = express.Router();
router.get('/advancedSearch/fetchForAdvancedSearch/:genericType/:genericItemType', fetchForAdvancedSearch);
router.put('/advancedSearch/:genericType', advancedSearchGeneric);
// genericItemType: characteristic, question, ...
// genericType: client, organization, ...



module.exports = router;