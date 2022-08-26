const express = require('express');
const {fetchForAdvancedSearch} = require("../services/advancedSearch");

const router = express.Router();
router.get('/advancedSearch/fetchForAdvancedSearch/:genericType/:genericItemType', fetchForAdvancedSearch)
// genericItemType: characteristic, question, ...
// genericType: client, organization, ...



module.exports = router;